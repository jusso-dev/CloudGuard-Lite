export type Severity = "low" | "medium" | "high" | "critical";
export type FindingStatus = "pass" | "fail" | "warning" | "not_applicable" | "error";
export type CloudProvider = "azure" | "aws" | "microsoft365";
export type ControlStatus = "not_started" | "partial" | "implemented" | "verified";

export type OrganisationProfile = {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  cloudProviders: CloudProvider[];
  usesMicrosoft365: boolean;
  handlesSensitive: boolean;
  hasRemoteWorkers: boolean;
  hasContractors: boolean;
  backupApproach: string;
  mfaApproach: string;
  deviceManagement: string;
  incidentMaturity: string;
};

export type AssessmentAnswer = {
  questionId: string;
  value: string | boolean | number;
};

export type Finding = {
  id: string;
  checkId: string;
  provider: CloudProvider;
  category: string;
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  evidence: Record<string, unknown>;
  affectedResource?: string;
  remediation: string;
  complianceTags: string[];
  scanRunId?: string;
  createdAt: string;
  engine?: "native" | "prowler" | "demo";
};

export type Control = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: ControlStatus;
  recommendedAction: string;
};
