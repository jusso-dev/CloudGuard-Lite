import { assessmentQuestions } from "@/lib/assessment/questions";
import type { AssessmentAnswer, Finding, OrganisationProfile } from "@/lib/types";

export type PolicyType =
  | "acceptable-use"
  | "access-control"
  | "backup-recovery"
  | "incident-response"
  | "password-mfa"
  | "cloud-security"
  | "vendor-access"
  | "data-handling"
  | "patch-management";

export const policyCatalog: Array<{ type: PolicyType; title: string; controls: string[] }> = [
  { type: "acceptable-use", title: "Acceptable Use Policy", controls: ["DAT-001", "DEV-001"] },
  { type: "access-control", title: "Access Control Policy", controls: ["IAM-001", "IAM-002"] },
  { type: "backup-recovery", title: "Backup and Recovery Policy", controls: ["BCK-001"] },
  { type: "incident-response", title: "Incident Response Policy", controls: ["IR-001", "LOG-001"] },
  { type: "password-mfa", title: "Password and MFA Policy", controls: ["IAM-001"] },
  { type: "cloud-security", title: "Cloud Security Policy", controls: ["CLD-001", "CLD-002", "LOG-001"] },
  { type: "vendor-access", title: "Vendor Access Policy", controls: ["IAM-002", "DAT-001"] },
  { type: "data-handling", title: "Data Handling Policy", controls: ["DAT-001"] },
  { type: "patch-management", title: "Patch Management Policy", controls: ["DEV-001"] }
];

function listRelevantFindings(findings: Finding[], controls: string[]) {
  return findings
    .filter((finding) => finding.complianceTags.some((tag) => controls.includes(tag)))
    .slice(0, 5);
}

function answerLine(answers: AssessmentAnswer[]) {
  const answered = new Set(answers.map((answer) => answer.questionId));
  const labels = assessmentQuestions
    .filter((question) => question.controlTags.some((tag) => answered.has(question.id)))
    .slice(0, 4)
    .map((question) => `- ${question.text}`);
  return labels.length > 0 ? labels.join("\n") : "- No assessment context was provided.";
}

export function generatePolicyTemplate(input: {
  type: PolicyType;
  organisation: OrganisationProfile;
  answers: AssessmentAnswer[];
  findings: Finding[];
}) {
  const catalogItem = policyCatalog.find((item) => item.type === input.type);
  if (!catalogItem) {
    throw new Error(`Unknown policy type: ${input.type}`);
  }

  const relevantFindings = listRelevantFindings(input.findings, catalogItem.controls);
  const findingLines =
    relevantFindings.length > 0
      ? relevantFindings
          .map(
            (finding) =>
              `- ${finding.title} (${finding.severity}, ${finding.status})${finding.affectedResource ? `: ${finding.affectedResource}` : ""}`
          )
          .join("\n")
      : "- No related findings are currently recorded.";

  const cloudList = input.organisation.cloudProviders.join(", ") || "not specified";

  return `# ${catalogItem.title}

## Purpose

This internal policy defines practical security expectations for ${input.organisation.name}. It is intended to support internal security posture improvement and does not claim legal compliance or external certification.

## Scope

This policy applies to employees, contractors, and approved vendors who access company systems, cloud services, or sensitive information. The current organisation profile notes ${input.organisation.employeeCount} employees, ${input.organisation.industry}, cloud providers: ${cloudList}, Microsoft 365 usage: ${input.organisation.usesMicrosoft365 ? "yes" : "no"}, sensitive data handling: ${input.organisation.handlesSensitive ? "yes" : "no"}.

## Current Context

- Backup approach: ${input.organisation.backupApproach}
- MFA approach: ${input.organisation.mfaApproach}
- Device management: ${input.organisation.deviceManagement}
- Incident response maturity: ${input.organisation.incidentMaturity}

## Assessment Signals

${answerLine(input.answers)}

## Related Findings

${findingLines}

## Policy Requirements

1. Owners must be assigned for systems and information repositories covered by this policy.
2. Access must follow least-privilege principles and be reviewed when roles, vendors, or contractors change.
3. Security exceptions must be documented with an owner, reason, expiry date, and compensating controls.
4. Evidence of key activities such as reviews, restore tests, logging changes, or access changes must be retained.
5. High and critical findings related to this policy must have a tracked remediation plan.

## Review Cadence

This policy should be reviewed at least annually, and after major cloud, identity, business, or incident response changes.
`;
}
