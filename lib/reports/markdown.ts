import { demoControlMappings } from "@/lib/fixtures/demo-data";
import type { AssessmentAnswer, Finding, OrganisationProfile } from "@/lib/types";
import { scoreAssessment } from "@/lib/assessment/scoring";
import { policyCatalog } from "@/lib/policies/templates";

export function generateMarkdownReport(input: {
  organisation: OrganisationProfile;
  answers: AssessmentAnswer[];
  findings: Finding[];
}) {
  const assessment = scoreAssessment(input.answers);
  const failedFindings = input.findings.filter((finding) => finding.status === "fail");
  const criticalOrHigh = failedFindings.filter((finding) =>
    ["critical", "high"].includes(finding.severity)
  );

  return `# CloudGuard Lite Posture Report

## Organisation

- Name: ${input.organisation.name}
- Industry: ${input.organisation.industry}
- Employees: ${input.organisation.employeeCount}
- Cloud providers: ${input.organisation.cloudProviders.join(", ")}
- Handles sensitive data: ${input.organisation.handlesSensitive ? "yes" : "no"}

## Assessment Summary

- Maturity score: ${assessment.maturityScore}/100
- Completed questions: ${assessment.completedQuestions}/${assessment.totalQuestions}
- High-risk gaps: ${assessment.highRiskGaps.length}

## Scan Summary

- Findings reviewed: ${input.findings.length}
- Failed findings: ${failedFindings.length}
- Critical or high failed findings: ${criticalOrHigh.length}

## Top Findings

${criticalOrHigh
  .slice(0, 5)
  .map((finding) => `- ${finding.title}: ${finding.remediation}`)
  .join("\n")}

## Control Maturity

${demoControlMappings
  .map((control) => `- ${control.id} ${control.title}: ${control.status}`)
  .join("\n")}

## Recommended 30-Day Action Plan

1. Close broad public cloud exposure and document any approved exceptions.
2. Confirm backup coverage and complete one restore test for a critical workload.
3. Enable diagnostic logging for production resources and verify retention.
4. Complete an administrator and vendor access review.
5. Generate or refresh internal policies tied to open findings.

## Generated Policy Library

${policyCatalog
  .slice(0, 5)
  .map((policy) => `- ${policy.title}`)
  .join("\n")}

This report supports internal security posture tracking. It does not claim certification, audit completion, or legal compliance.
`;
}
