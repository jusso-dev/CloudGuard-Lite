import { describe, expect, it } from "vitest";
import {
  buildProwlerExecutionErrorResult,
  getProwlerComplianceArgs,
  getProwlerSeverityArgs
} from "@/lib/prowler/runner";

describe("Prowler runner config", () => {
  it("defaults to CIS profiles per provider", () => {
    expect(getProwlerComplianceArgs("azure")).toEqual(["--compliance", "cis_2.0_azure"]);
    expect(getProwlerComplianceArgs("aws")).toEqual(["--compliance", "cis_2.0_aws"]);
    expect(getProwlerComplianceArgs("m365")).toEqual(["--compliance", "cis_2.0_m365"]);
  });

  it("defaults to actionable severities", () => {
    expect(getProwlerSeverityArgs()).toEqual(["--severity", "critical", "high", "medium"]);
  });

  it("turns engine failures into scanner results", () => {
    const result = buildProwlerExecutionErrorResult({
      provider: "aws",
      resourceId: "123456789012",
      resourceName: "AWS account",
      message: "prowler: not found"
    });

    expect(result.status).toBe("error");
    expect(result.engine).toBe("prowler");
    expect(result.remediation).toContain("Install Prowler");
  });
});
