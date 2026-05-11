import { z } from "zod";

export type AnswerType = "yes_no" | "maturity" | "free_text" | "multiple_choice";

export type AssessmentQuestion = {
  id: string;
  category: string;
  text: string;
  helpText: string;
  answerType: AnswerType;
  options?: string[];
  riskImpact: 1 | 2 | 3 | 4 | 5;
  controlTags: string[];
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "iam-admin-mfa",
    category: "Identity and access",
    text: "Are privileged user accounts protected by MFA?",
    helpText: "Focus on admin portals, cloud consoles, finance systems, and identity providers.",
    answerType: "yes_no",
    riskImpact: 5,
    controlTags: ["IAM-001", "IAM-002"]
  },
  {
    id: "mfa-coverage",
    category: "Multi-factor authentication",
    text: "How mature is MFA coverage across the organisation?",
    helpText: "Consider employees, contractors, service accounts, and break-glass accounts.",
    answerType: "maturity",
    riskImpact: 5,
    controlTags: ["IAM-001"]
  },
  {
    id: "backup-tested",
    category: "Backups and recovery",
    text: "Are backups tested on a defined schedule?",
    helpText: "A backup plan is only reliable when restores are tested.",
    answerType: "yes_no",
    riskImpact: 5,
    controlTags: ["BCK-001"]
  },
  {
    id: "device-managed",
    category: "Device security",
    text: "Are employee devices enrolled in device management?",
    helpText: "Look for central inventory, baseline controls, disk encryption, and remote wipe.",
    answerType: "maturity",
    riskImpact: 4,
    controlTags: ["DEV-001", "DAT-001"]
  },
  {
    id: "patch-cadence",
    category: "Patch management",
    text: "What is the normal patching cadence for laptops and servers?",
    helpText: "Shorter, tracked cadences reduce exposure to known vulnerabilities.",
    answerType: "multiple_choice",
    options: ["Weekly", "Monthly", "Quarterly", "Ad hoc", "Not tracked"],
    riskImpact: 4,
    controlTags: ["DEV-001"]
  },
  {
    id: "email-protection",
    category: "Email security",
    text: "Are phishing protection and domain authentication configured?",
    helpText: "Consider SPF, DKIM, DMARC, attachment scanning, and user reporting.",
    answerType: "maturity",
    riskImpact: 3,
    controlTags: ["DAT-001", "IR-001"]
  },
  {
    id: "logging-critical",
    category: "Logging and monitoring",
    text: "Are critical system and cloud activity logs reviewed?",
    helpText: "Logs should be retained, searchable, and reviewed for privileged activity.",
    answerType: "maturity",
    riskImpact: 4,
    controlTags: ["LOG-001", "CLD-002"]
  },
  {
    id: "incident-plan",
    category: "Incident response",
    text: "Does the organisation maintain an incident response plan?",
    helpText: "A lightweight plan should include roles, escalation paths, contact details, and decision points.",
    answerType: "yes_no",
    riskImpact: 4,
    controlTags: ["IR-001"]
  },
  {
    id: "sensitive-data",
    category: "Data protection",
    text: "Where is sensitive data stored and who can access it?",
    helpText: "Describe the main repositories, sharing patterns, and review cadence.",
    answerType: "free_text",
    riskImpact: 4,
    controlTags: ["DAT-001"]
  },
  {
    id: "vendor-access",
    category: "Vendor access",
    text: "Is vendor and contractor access reviewed at least quarterly?",
    helpText: "Include external administrators, contractors, and managed service accounts.",
    answerType: "yes_no",
    riskImpact: 3,
    controlTags: ["IAM-002", "DAT-001"]
  },
  {
    id: "cloud-tags",
    category: "Cloud configuration",
    text: "Are cloud resources tagged with owner, environment, and backup requirements?",
    helpText: "Tags help assign ownership and make operational checks measurable.",
    answerType: "maturity",
    riskImpact: 3,
    controlTags: ["CLD-001", "LOG-001"]
  }
];

export const assessmentAnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.boolean(), z.number()])
});

export const assessmentSubmissionSchema = z.object({
  answers: z.array(assessmentAnswerSchema).min(1)
});
