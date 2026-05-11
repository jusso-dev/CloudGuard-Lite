import { describe, expect, it } from "vitest";
import { normalizeScannerResult } from "@/lib/scanner/types";

describe("normalizeScannerResult", () => {
  it("validates scanner output shape", () => {
    const result = normalizeScannerResult({
      checkId: "check",
      title: "Check",
      description: "Description",
      severity: "high",
      status: "fail",
      evidence: { value: true },
      remediation: "Fix it",
      complianceTags: ["CLD-001"]
    });

    expect(result.provider).toBe("azure");
    expect(result.category).toBe("Cloud configuration");
  });
});
