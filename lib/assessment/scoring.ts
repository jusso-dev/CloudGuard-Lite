import { assessmentQuestions } from "@/lib/assessment/questions";
import type { AssessmentAnswer } from "@/lib/types";

const maturityValue: Record<string, number> = {
  none: 0,
  informal: 1,
  developing: 2,
  managed: 3,
  optimized: 4
};

function answerPoints(value: AssessmentAnswer["value"]) {
  if (typeof value === "boolean") {
    return value ? 4 : 0;
  }

  if (typeof value === "number") {
    return Math.max(0, Math.min(4, value));
  }

  const normalized = value.toLowerCase();
  if (normalized in maturityValue) {
    return maturityValue[normalized];
  }

  if (["weekly", "monthly"].includes(normalized)) {
    return 4;
  }

  if (["quarterly"].includes(normalized)) {
    return 2;
  }

  if (["ad hoc", "not tracked", "no"].includes(normalized)) {
    return 0;
  }

  return value.trim().length > 12 ? 2 : 0;
}

export function scoreAssessment(answers: AssessmentAnswer[]) {
  const byQuestion = new Map(answers.map((answer) => [answer.questionId, answer]));
  let earned = 0;
  let possible = 0;
  const highRiskGaps: Array<{ questionId: string; text: string; controlTags: string[] }> = [];

  for (const question of assessmentQuestions) {
    const answer = byQuestion.get(question.id);
    const weight = question.riskImpact;
    possible += weight * 4;
    const points = answer ? answerPoints(answer.value) : 0;
    earned += points * weight;

    if (question.riskImpact >= 4 && points < 2) {
      highRiskGaps.push({
        questionId: question.id,
        text: question.text,
        controlTags: question.controlTags
      });
    }
  }

  const maturityScore = possible === 0 ? 0 : Math.round((earned / possible) * 100);
  const recommendedActions = highRiskGaps.slice(0, 5).map((gap) => ({
    title: gap.text,
    controlTags: gap.controlTags,
    action: "Assign an owner, document the current state, and set a 30-day improvement target."
  }));

  return {
    maturityScore,
    highRiskGaps,
    recommendedActions,
    completedQuestions: answers.length,
    totalQuestions: assessmentQuestions.length
  };
}
