import { buildProwlerExecutionErrorResult, runProwlerAws } from "@/lib/prowler/runner";
import type { ScannerCheckResult } from "@/lib/scanner/types";

export type AwsAccessKeyConnectionInput = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  regions?: string[];
};

export async function runAwsProwlerScan(
  connection: AwsAccessKeyConnectionInput,
  scanRunId = `aws-${Date.now()}`
): Promise<ScannerCheckResult[]> {
  try {
    return await runProwlerAws({
      runId: scanRunId,
      accessKeyId: connection.accessKeyId,
      secretAccessKey: connection.secretAccessKey,
      sessionToken: connection.sessionToken,
      regions: connection.regions ?? []
    });
  } catch (error) {
    return [
      buildProwlerExecutionErrorResult({
        provider: "aws",
        resourceId: "aws-account",
        resourceName: "AWS account",
        message: error instanceof Error ? error.message : "Unknown Prowler error"
      })
    ];
  }
}
