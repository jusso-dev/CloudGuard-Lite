import { spawn } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ScannerCheckResult } from "@/lib/scanner/types";
import { readProwlerOcsfFile } from "@/lib/prowler/adapter";
import type { ProwlerProvider } from "@/lib/prowler/check-mappings";

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000;
const DEFAULT_PROWLER_VERSION = "3.11.3";

type RunProwlerProviderParams = {
  provider: ProwlerProvider;
  runId: string;
  env: Record<string, string | undefined>;
  args?: string[];
  timeoutMs?: number;
};

function truncate(value: string, maxLength = 12000) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}\n[truncated]` : value;
}

async function findOcsfOutputFile(outputDir: string) {
  const entries = await readdir(outputDir, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => join(outputDir, entry.name));

  return (
    files.find((file) => file.endsWith("findings.ocsf.json")) ??
    files.find((file) => file.endsWith(".ocsf.json")) ??
    files.find((file) => file.includes("ocsf") && file.endsWith(".json")) ??
    files.find((file) => file.endsWith(".json")) ??
    null
  );
}

export function getProwlerVersion() {
  return process.env.PROWLER_VERSION || DEFAULT_PROWLER_VERSION;
}

export function getProwlerConcurrency() {
  const parsed = Number.parseInt(process.env.PROWLER_CONCURRENCY || "2", 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 4) : 2;
}

const complianceDefaults: Record<ProwlerProvider, string> = {
  aws: "cis_2.0_aws",
  azure: "cis_2.0_azure",
  m365: "cis_2.0_m365"
};

export function getProwlerComplianceArgs(provider: ProwlerProvider): string[] {
  const envKey =
    provider === "aws"
      ? "PROWLER_COMPLIANCE_AWS"
      : provider === "azure"
        ? "PROWLER_COMPLIANCE_AZURE"
        : "PROWLER_COMPLIANCE_M365";
  const raw = process.env[envKey];
  const value = raw === undefined ? complianceDefaults[provider] : raw.trim();
  return value ? ["--compliance", value] : [];
}

const excludedServiceDefaults: Record<ProwlerProvider, string> = {
  aws: "securityhub,guardduty,macie,inspector2",
  azure: "defender,monitor",
  m365: ""
};

export function getProwlerExcludeServicesArgs(provider: ProwlerProvider): string[] {
  const envKey =
    provider === "aws"
      ? "PROWLER_AWS_EXCLUDE_SERVICES"
      : provider === "azure"
        ? "PROWLER_AZURE_EXCLUDE_SERVICES"
        : "PROWLER_M365_EXCLUDE_SERVICES";
  const raw = process.env[envKey];
  const value = raw === undefined ? excludedServiceDefaults[provider] : raw.trim();
  if (!value) return [];
  const services = value.split(",").map((service) => service.trim()).filter(Boolean);
  return services.length > 0 ? ["--excluded-services", ...services] : [];
}

export function getProwlerSeverityArgs(): string[] {
  const raw = process.env.PROWLER_SEVERITY;
  const value = raw === undefined ? "critical,high,medium" : raw.trim();
  if (!value) return [];
  const severities = value.split(",").map((severity) => severity.trim().toLowerCase()).filter(Boolean);
  return severities.length > 0 ? ["--severity", ...severities] : [];
}

function inferProwlerRemediation(provider: ProwlerProvider, message: string) {
  const haystack = message.toLowerCase();
  if (haystack.includes("timed out after")) {
    return "Reduce scan scope or increase worker resources before re-running the Prowler scan.";
  }
  if (haystack.includes("enoent") || haystack.includes("prowler: not found") || haystack.includes("command not found")) {
    return `Install Prowler in the worker image or set PROWLER_BIN. The default pinned version is ${getProwlerVersion()}.`;
  }
  if (provider === "azure" && haystack.includes("authorizationfailed")) {
    return "Grant the service principal Reader and Security Reader at subscription scope, then re-run the scan.";
  }
  if (provider === "azure" && (haystack.includes("aadsts7000215") || haystack.includes("invalid client secret"))) {
    return "Rotate the Azure client secret and update the encrypted connection.";
  }
  if (provider === "aws" && (haystack.includes("accessdenied") || haystack.includes("not authorized"))) {
    return "Attach read-only audit permissions such as SecurityAudit and ViewOnlyAccess to the scanner credentials.";
  }
  if (provider === "m365" && (haystack.includes("insufficient privileges") || haystack.includes("authorization_requestdenied"))) {
    return "Grant the Microsoft Graph read permissions required by Prowler for Microsoft 365 checks and consent them in the tenant.";
  }
  return "Verify Prowler is installed and the cloud credentials have read-only audit coverage. Full stderr is included in evidence.";
}

export function buildProwlerExecutionErrorResult(params: {
  provider: ProwlerProvider;
  resourceId: string;
  resourceName: string;
  message: string;
}): ScannerCheckResult {
  return {
    checkId: `prowler::${params.provider}-engine`,
    title: "Prowler CSPM engine did not complete",
    description: params.message,
    severity: "low",
    status: "error",
    evidence: {
      engine: "prowler",
      provider: params.provider,
      pinnedVersion: getProwlerVersion(),
      error: params.message
    },
    affectedResource: params.resourceName || params.resourceId,
    remediation: inferProwlerRemediation(params.provider, params.message),
    complianceTags: ["CLD-002"],
    category: "Cloud configuration",
    provider: params.provider === "m365" ? "microsoft365" : params.provider,
    engine: "prowler"
  };
}

export async function runProwlerProvider({
  provider,
  runId,
  env,
  args = [],
  timeoutMs = DEFAULT_TIMEOUT_MS
}: RunProwlerProviderParams): Promise<ScannerCheckResult[]> {
  const outputDir = await mkdtemp(join(tmpdir(), `cloudguard-prowler-${runId}-${provider}-`));
  const prowlerBin = process.env.PROWLER_BIN || "prowler";
  const prowlerArgs = [provider, "-M", "json-ocsf", "-o", outputDir, ...args];

  try {
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(prowlerBin, prowlerArgs, {
        env: {
          ...process.env,
          ...env,
          PROWLER_VERSION: getProwlerVersion()
        },
        stdio: ["ignore", "pipe", "pipe"]
      });

      let stdout = "";
      let stderr = "";
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        child.kill("SIGKILL");
        reject(new Error(`Prowler ${provider} timed out after ${Math.round(timeoutMs / 60000)} minutes.`));
      }, timeoutMs);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error);
      });
      child.on("close", (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (code === 0) {
          resolve({ stdout, stderr });
          return;
        }
        reject(
          new Error(
            `Prowler ${provider} exited with ${code}. stdout=${truncate(stdout)} stderr=${truncate(stderr)}`
          )
        );
      });
    });

    const outputFile = await findOcsfOutputFile(outputDir);
    if (!outputFile) {
      throw new Error(
        `Prowler ${provider} completed but no OCSF JSON output was found. stdout=${truncate(result.stdout)} stderr=${truncate(result.stderr)}`
      );
    }

    return readProwlerOcsfFile(outputFile);
  } finally {
    await rm(outputDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function runProwlerAzure(params: {
  runId: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  subscriptionId: string;
}) {
  return runProwlerProvider({
    provider: "azure",
    runId: `${params.runId}-${params.subscriptionId}`,
    env: {
      AZURE_TENANT_ID: params.tenantId,
      AZURE_CLIENT_ID: params.clientId,
      AZURE_CLIENT_SECRET: params.clientSecret,
      AZURE_SUBSCRIPTION_ID: params.subscriptionId
    },
    args: [
      "--sp-env-auth",
      "--subscription-ids",
      params.subscriptionId,
      ...getProwlerComplianceArgs("azure"),
      ...getProwlerExcludeServicesArgs("azure"),
      ...getProwlerSeverityArgs()
    ]
  });
}

export async function runProwlerAws(params: {
  runId: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  regions: string[];
}) {
  return runProwlerProvider({
    provider: "aws",
    runId: `${params.runId}-aws`,
    env: {
      AWS_ACCESS_KEY_ID: params.accessKeyId,
      AWS_SECRET_ACCESS_KEY: params.secretAccessKey,
      AWS_SESSION_TOKEN: params.sessionToken,
      AWS_REGION: params.regions[0] || process.env.AWS_REGION || "us-east-1"
    },
    args: [
      ...(params.regions.length > 0 ? ["--region", ...params.regions] : []),
      ...getProwlerComplianceArgs("aws"),
      ...getProwlerExcludeServicesArgs("aws"),
      ...getProwlerSeverityArgs()
    ]
  });
}

export async function runProwlerM365(params: {
  runId: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
}) {
  return runProwlerProvider({
    provider: "m365",
    runId: `${params.runId}-m365`,
    env: {
      AZURE_TENANT_ID: params.tenantId,
      AZURE_CLIENT_ID: params.clientId,
      AZURE_CLIENT_SECRET: params.clientSecret
    },
    args: [
      "--sp-env-auth",
      ...getProwlerComplianceArgs("m365"),
      ...getProwlerExcludeServicesArgs("m365"),
      ...getProwlerSeverityArgs()
    ]
  });
}
