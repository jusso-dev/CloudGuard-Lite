import type { ScannerCheckResult } from "@/lib/scanner/types";
import { runDemoAzureScan } from "@/lib/scanner/demo-azure";
import { runRealAzureScan, type AzureConnectionInput } from "@/lib/scanner/azure-real";
import { runAwsProwlerScan, type AwsAccessKeyConnectionInput } from "@/lib/scanner/aws-prowler";
import { runM365ProwlerScan, type M365ConnectionInput } from "@/lib/scanner/m365-prowler";

export type ProviderScanInput =
  | { provider: "azure"; mode: "demo"; scanRunId?: string }
  | {
      provider: "azure";
      mode: "real";
      scanRunId?: string;
      connection: AzureConnectionInput;
      useProwler?: boolean;
    }
  | {
      provider: "aws";
      mode: "real";
      scanRunId?: string;
      connection: AwsAccessKeyConnectionInput;
    }
  | {
      provider: "microsoft365";
      mode: "real";
      scanRunId?: string;
      connection: M365ConnectionInput;
    };

export async function runProviderScan(input: ProviderScanInput): Promise<ScannerCheckResult[]> {
  if (input.provider === "azure" && input.mode === "demo") {
    return runDemoAzureScan(input.scanRunId).map((finding) => ({
      checkId: finding.checkId,
      title: finding.title,
      description: finding.description,
      severity: finding.severity,
      status: finding.status,
      evidence: finding.evidence,
      affectedResource: finding.affectedResource,
      remediation: finding.remediation,
      complianceTags: finding.complianceTags,
      category: finding.category,
      provider: "azure",
      engine: "demo"
    }));
  }

  if (input.provider === "azure") {
    return runRealAzureScan(input.connection, {
      scanRunId: input.scanRunId,
      useProwler: input.useProwler ?? true
    });
  }

  if (input.provider === "aws") {
    return runAwsProwlerScan(input.connection, input.scanRunId);
  }

  return runM365ProwlerScan(input.connection, input.scanRunId);
}
