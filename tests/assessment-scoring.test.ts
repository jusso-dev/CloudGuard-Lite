import { describe, expect, it } from "vitest";
import { scoreAssessment } from "@/lib/assessment/scoring";
import { demoAnswers } from "@/lib/fixtures/demo-data";

describe("scoreAssessment", () => {
  it("calculates a bounded maturity score", () => {
    const result = scoreAssessment(demoAnswers);
    expect(result.maturityScore).toBeGreaterThan(0);
    expect(result.maturityScore).toBeLessThanOrEqual(100);
    expect(result.highRiskGaps.length).toBeGreaterThan(0);
  });

  it("penalizes unanswered high-risk questions", () => {
    const result = scoreAssessment([]);
    expect(result.maturityScore).toBe(0);
    expect(result.highRiskGaps.some((gap) => gap.questionId === "backup-tested")).toBe(true);
  });
});
