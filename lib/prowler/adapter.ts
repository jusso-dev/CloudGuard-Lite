import { readFile } from "node:fs/promises";
import { getProwlerCheckMapping } from "@/lib/prowler/check-mappings";
import type { ScannerCheckResult } from "@/lib/scanner/types";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asRecord(value: unknown): JsonRecord {
  return isRecord(value) ? value : {};
}

function getPath(value: unknown, path: string[]) {
  let current = value;
  for (const segment of path) {
    if (!isRecord(current)) return undefined;
    current = current[segment];
  }
  return current;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function normalizeStatus(value: unknown): ScannerCheckResult["status"] {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("pass") || status === "resolved") return "pass";
  if (status.includes("fail") || status === "new" || status === "suppressed") return "fail";
  if (status.includes("manual") || status.includes("unknown")) return "warning";
  if (status.includes("muted") || status.includes("not_applicable")) return "not_applicable";
  if (status.includes("warn")) return "warning";
  return "warning";
}

function normalizeSeverity(value: unknown): ScannerCheckResult["severity"] {
  const severity = String(value ?? "").toLowerCase();
  if (severity === "critical" || severity === "fatal") return "critical";
  if (severity === "high") return "high";
  if (severity === "medium" || severity === "moderate") return "medium";
  return "low";
}

function normalizeProvider(value: unknown): ScannerCheckResult["provider"] {
  const provider = String(value ?? "").toLowerCase();
  if (provider.includes("aws")) return "aws";
  if (provider.includes("m365") || provider.includes("microsoft")) return "microsoft365";
  return "azure";
}

function extractProwlerCheckId(finding: JsonRecord) {
  const candidates = [
    finding.check_id,
    finding.checkId,
    finding.check_uid,
    finding.checkUid,
    getPath(finding, ["finding_info", "uid"]),
    getPath(finding, ["finding_info", "src_url"]),
    getPath(finding, ["metadata", "product", "feature", "uid"]),
    getPath(finding, ["metadata", "uid"]),
    getPath(finding, ["unmapped", "check_id"]),
    getPath(finding, ["unmapped", "check_metadata", "CheckID"])
  ];

  for (const candidate of candidates) {
    const value = asString(candidate);
    if (!value) continue;
    const checkIdFromUrl = value.match(/checks\/([^/#?]+)/)?.[1];
    return checkIdFromUrl ?? value.replace(/^prowler::/, "");
  }

  return "unknown";
}

function extractTitle(finding: JsonRecord, checkId: string) {
  return (
    asString(getPath(finding, ["finding_info", "title"])) ??
    asString(finding.title) ??
    asString(getPath(finding, ["unmapped", "check_metadata", "CheckTitle"])) ??
    checkId
  );
}

function extractDescription(finding: JsonRecord) {
  return (
    asString(finding.message) ??
    asString(getPath(finding, ["finding_info", "desc"])) ??
    asString(finding.description) ??
    asString(getPath(finding, ["unmapped", "check_metadata", "Description"])) ??
    "Prowler reported this CSPM finding."
  );
}

function extractRemediation(finding: JsonRecord) {
  const remediation = asRecord(finding.remediation);
  const recommendation = getPath(finding, [
    "unmapped",
    "check_metadata",
    "Remediation",
    "Recommendation",
    "Text"
  ]);

  return (
    asString(remediation.desc) ??
    asString(remediation.description) ??
    asString(recommendation) ??
    asString(finding.remediation) ??
    "Review the Prowler finding details and apply the provider-specific remediation."
  );
}

function extractResources(finding: JsonRecord) {
  const resources = asArray(finding.resources)
    .map((resource) => asRecord(resource))
    .filter((resource) => Object.keys(resource).length > 0);

  if (resources.length > 0) return resources;

  const cloud = asRecord(finding.cloud);
  const account = asRecord(cloud.account);
  const accountId = asString(account.uid) ?? asString(account.uid_alt) ?? asString(account.name);
  if (accountId) {
    return [{ uid: accountId, name: asString(account.name) ?? accountId, type: "cloud_account" }];
  }

  return [{ uid: "unknown", name: "Unknown resource", type: "cloud_resource" }];
}

function parseProwlerPayload(raw: unknown) {
  if (Array.isArray(raw)) return raw;
  if (!isRecord(raw)) return [];
  for (const key of ["findings", "items", "results", "data"]) {
    if (Array.isArray(raw[key])) return raw[key];
  }
  return [raw];
}

export function adaptProwlerOcsfFindings(rawPayload: unknown): ScannerCheckResult[] {
  return parseProwlerPayload(rawPayload)
    .map((finding) => asRecord(finding))
    .filter((finding) => Object.keys(finding).length > 0)
    .flatMap((finding) => {
      const prowlerCheckId = extractProwlerCheckId(finding);
      const mapping = getProwlerCheckMapping(prowlerCheckId);
      const resources = extractResources(finding);
      const cloud = asRecord(finding.cloud);
      const provider = normalizeProvider(cloud.provider ?? finding.provider);

      return resources.map((resource) => {
        const resourceId =
          asString(resource.uid) ??
          asString(resource.id) ??
          asString(resource.arn) ??
          asString(resource.name) ??
          "unknown";

        return {
          checkId: `prowler::${prowlerCheckId}`,
          title: extractTitle(finding, prowlerCheckId),
          description: extractDescription(finding),
          severity: normalizeSeverity(finding.severity ?? finding.severity_id),
          status: normalizeStatus(finding.status ?? finding.status_detail ?? finding.status_id),
          evidence: {
            engine: "prowler",
            prowlerCheckId,
            resource,
            finding,
            frameworkRefs: mapping?.complianceTags ?? []
          },
          affectedResource: asString(resource.name) ?? resourceId,
          remediation: extractRemediation(finding),
          complianceTags: mapping?.complianceTags ?? ["CLD-001"],
          category: mapping?.category ?? "Cloud configuration",
          provider,
          engine: "prowler"
        };
      });
    });
}

export async function readProwlerOcsfFile(filePath: string) {
  const text = await readFile(filePath, "utf8");
  return adaptProwlerOcsfFindings(JSON.parse(text));
}
