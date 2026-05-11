import { z } from "zod";

export const scannerCheckResultSchema = z.object({
  checkId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["pass", "fail", "warning", "not_applicable", "error"]),
  evidence: z.record(z.unknown()).default({}),
  affectedResource: z.string().optional(),
  remediation: z.string().min(1),
  complianceTags: z.array(z.string()).min(1),
  category: z.string().default("Cloud configuration"),
  provider: z.enum(["azure", "aws", "microsoft365"]).default("azure"),
  engine: z.enum(["native", "prowler", "demo"]).default("native")
});

export type ScannerCheckResult = z.infer<typeof scannerCheckResultSchema>;

export function normalizeScannerResult(input: unknown): ScannerCheckResult {
  return scannerCheckResultSchema.parse(input);
}
