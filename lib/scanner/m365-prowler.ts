import { buildProwlerExecutionErrorResult, runProwlerM365 } from "@/lib/prowler/runner";
import type { ScannerCheckResult } from "@/lib/scanner/types";

export type M365ConnectionInput = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
};

export async function runM365ProwlerScan(
  connection: M365ConnectionInput,
  scanRunId = `m365-${Date.now()}`
): Promise<ScannerCheckResult[]> {
  try {
    return await runProwlerM365({
      runId: scanRunId,
      tenantId: connection.tenantId,
      clientId: connection.clientId,
      clientSecret: connection.clientSecret
    });
  } catch (error) {
    return [
      buildProwlerExecutionErrorResult({
        provider: "m365",
        resourceId: connection.tenantId,
        resourceName: "Microsoft 365 tenant",
        message: error instanceof Error ? error.message : "Unknown Prowler error"
      })
    ];
  }
}
