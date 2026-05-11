import { assessmentQuestions } from "@/lib/assessment/questions";
import { controlFramework } from "@/lib/controls/control-framework";
import type { AssessmentAnswer, Control, Finding } from "@/lib/types";

export type ControlMapping = Control & {
  relatedFindings: Finding[];
  relatedAssessmentQuestionIds: string[];
};

export function mapControlsToEvidence(
  findings: Finding[],
  answers: AssessmentAnswer[]
): ControlMapping[] {
  const answeredIds = new Set(answers.map((answer) => answer.questionId));

  return controlFramework.map((control) => {
    const relatedFindings = findings.filter((finding) =>
      finding.complianceTags.includes(control.id)
    );
    const relatedAssessmentQuestionIds = assessmentQuestions
      .filter(
        (question) =>
          question.controlTags.includes(control.id) && answeredIds.has(question.id)
      )
      .map((question) => question.id);

    const hasFailedFinding = relatedFindings.some((finding) =>
      ["fail", "error"].includes(finding.status)
    );
    const hasWarning = relatedFindings.some((finding) => finding.status === "warning");
    const hasEvidence = relatedFindings.length > 0 || relatedAssessmentQuestionIds.length > 0;

    return {
      ...control,
      relatedFindings,
      relatedAssessmentQuestionIds,
      status: hasFailedFinding
        ? "partial"
        : hasWarning
          ? "partial"
          : hasEvidence
            ? "implemented"
            : control.status
    };
  });
}
