import { scoreAssessment } from "@/lib/assessment/scoring";
import { mapControlsToEvidence } from "@/lib/controls/mapping";
import { runDemoAzureScan } from "@/lib/scanner/demo-azure";
import type { AssessmentAnswer, OrganisationProfile } from "@/lib/types";

export const demoOrganisation: OrganisationProfile = {
  id: "org_demo",
  name: "Northstar Medical Group",
  industry: "Healthcare services",
  employeeCount: 84,
  cloudProviders: ["azure"],
  usesMicrosoft365: true,
  handlesSensitive: true,
  hasRemoteWorkers: true,
  hasContractors: true,
  backupApproach: "Daily cloud backups for core systems, restore tests are informal.",
  mfaApproach: "MFA is enabled for admins and most employees, with contractor exceptions under review.",
  deviceManagement: "Company laptops are managed, BYOD coverage is limited.",
  incidentMaturity: "Documented contacts and escalation path, tabletop exercises not yet scheduled."
};

export const demoAnswers: AssessmentAnswer[] = [
  { questionId: "iam-admin-mfa", value: true },
  { questionId: "mfa-coverage", value: "developing" },
  { questionId: "backup-tested", value: false },
  { questionId: "device-managed", value: "developing" },
  { questionId: "patch-cadence", value: "Monthly" },
  { questionId: "email-protection", value: "managed" },
  { questionId: "logging-critical", value: "informal" },
  { questionId: "incident-plan", value: true },
  {
    questionId: "sensitive-data",
    value: "Patient records are held in a line-of-business system and exported to restricted SharePoint folders."
  },
  { questionId: "vendor-access", value: false },
  { questionId: "cloud-tags", value: "informal" }
];

export const demoFindings = runDemoAzureScan();
export const demoAssessmentSummary = scoreAssessment(demoAnswers);
export const demoControlMappings = mapControlsToEvidence(demoFindings, demoAnswers);

export const demoScanRuns = [
  {
    id: "scan_demo",
    provider: "azure",
    mode: "demo",
    status: "completed",
    startedAt: "2026-05-10T23:20:00.000Z",
    completedAt: "2026-05-10T23:22:00.000Z",
    findingCount: demoFindings.length
  }
];
