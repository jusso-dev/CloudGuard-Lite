import type { Control } from "@/lib/types";

export const controlFramework: Control[] = [
  {
    id: "IAM-001",
    title: "Enforce MFA for privileged users",
    description: "Privileged accounts should require phishing-resistant or app-based MFA wherever supported.",
    tags: ["identity", "mfa"],
    status: "partial",
    recommendedAction: "Confirm MFA coverage for every privileged account and document exceptions."
  },
  {
    id: "IAM-002",
    title: "Review administrator access",
    description: "Administrator and vendor access should be reviewed regularly and removed when no longer needed.",
    tags: ["identity", "access-review"],
    status: "partial",
    recommendedAction: "Run an admin access review and set a quarterly review calendar."
  },
  {
    id: "BCK-001",
    title: "Maintain tested backups",
    description: "Critical data and systems should have backups with tested restore procedures.",
    tags: ["backup", "recovery"],
    status: "not_started",
    recommendedAction: "Run a restore test for one critical workload and record the result."
  },
  {
    id: "LOG-001",
    title: "Enable logging for critical systems",
    description: "Security-relevant logs should be retained and reviewed for critical systems and cloud activity.",
    tags: ["logging", "monitoring"],
    status: "partial",
    recommendedAction: "Enable diagnostic logging for high-value cloud resources."
  },
  {
    id: "IR-001",
    title: "Maintain an incident response plan",
    description: "The organisation should maintain a simple plan covering roles, escalation, evidence, and communications.",
    tags: ["incident-response"],
    status: "not_started",
    recommendedAction: "Create a one-page incident response plan and test the contact path."
  },
  {
    id: "DEV-001",
    title: "Keep devices patched",
    description: "Managed devices should receive tracked security updates on a defined cadence.",
    tags: ["devices", "patching"],
    status: "partial",
    recommendedAction: "Define a patch SLA and confirm reporting for managed devices."
  },
  {
    id: "CLD-001",
    title: "Restrict public cloud exposure",
    description: "Cloud resources should avoid broad public exposure unless there is a documented business need.",
    tags: ["cloud", "network"],
    status: "partial",
    recommendedAction: "Review broad inbound rules and public storage exposure."
  },
  {
    id: "CLD-002",
    title: "Monitor privileged cloud activity",
    description: "Privileged cloud changes should be logged and monitored for unusual activity.",
    tags: ["cloud", "logging"],
    status: "partial",
    recommendedAction: "Enable activity log retention and alert on privileged changes."
  },
  {
    id: "DAT-001",
    title: "Protect sensitive data",
    description: "Sensitive data should have known locations, restricted access, and handling rules.",
    tags: ["data", "privacy"],
    status: "partial",
    recommendedAction: "Document sensitive data stores and confirm access owners."
  }
];
