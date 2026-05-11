import { describe, expect, it } from "vitest";
import { demoAnswers, demoFindings, demoOrganisation } from "@/lib/fixtures/demo-data";
import { generatePolicyTemplate } from "@/lib/policies/templates";

describe("generatePolicyTemplate", () => {
  it("uses organisation profile and findings without compliance claims", () => {
    const policy = generatePolicyTemplate({
      type: "cloud-security",
      organisation: demoOrganisation,
      answers: demoAnswers,
      findings: demoFindings
    });

    expect(policy).toContain(demoOrganisation.name);
    expect(policy).toContain("Related Findings");
    expect(policy).toContain("does not claim legal compliance");
    expect(policy).not.toContain("certified compliant");
  });
});
