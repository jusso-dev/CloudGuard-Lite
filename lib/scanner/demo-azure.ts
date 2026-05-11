import type { Finding } from "@/lib/types";
import { normalizeScannerResult, type ScannerCheckResult } from "@/lib/scanner/types";

const demoResults: ScannerCheckResult[] = [
  {
    checkId: "az-subscription-access",
    title: "Subscription access confirmed",
    description: "The scanner can enumerate subscription metadata for the configured tenant.",
    severity: "low",
    status: "pass",
    evidence: { subscriptionId: "00000000-demo", tenant: "demo-tenant" },
    affectedResource: "subscription/demo",
    remediation: "No action required. Keep least-privilege scanner access documented.",
    complianceTags: ["CLD-002"],
    category: "Cloud configuration",
    provider: "azure",
    engine: "demo"
  },
  {
    checkId: "az-public-storage",
    title: "Storage account public access risk",
    description: "A storage account allows public blob access and should be reviewed.",
    severity: "high",
    status: "fail",
    evidence: { allowBlobPublicAccess: true, containerCount: 3 },
    affectedResource: "stpublicdemo001",
    remediation: "Disable public blob access unless a documented business exception exists.",
    complianceTags: ["CLD-001", "DAT-001"],
    category: "Data protection",
    provider: "azure",
    engine: "demo"
  },
  {
    checkId: "az-keyvault-purge",
    title: "Key vault purge protection disabled",
    description: "A key vault has soft delete enabled but purge protection is not enabled.",
    severity: "medium",
    status: "warning",
    evidence: { softDelete: true, purgeProtection: false },
    affectedResource: "kv-payroll-demo",
    remediation: "Enable purge protection for production key vaults that hold sensitive secrets.",
    complianceTags: ["DAT-001", "IR-001"],
    category: "Data protection",
    provider: "azure",
    engine: "demo"
  },
  {
    checkId: "az-nsg-broad-rdp",
    title: "Broad inbound administration rule",
    description: "A network security group allows RDP from any source.",
    severity: "critical",
    status: "fail",
    evidence: { protocol: "TCP", port: 3389, source: "0.0.0.0/0" },
    affectedResource: "nsg-prod-management",
    remediation: "Restrict administration ports to approved source ranges or use just-in-time access.",
    complianceTags: ["CLD-001", "IAM-002"],
    category: "Network exposure",
    provider: "azure",
    engine: "demo"
  },
  {
    checkId: "az-vm-backup-tag",
    title: "Virtual machine missing backup tag",
    description: "A virtual machine does not declare backup requirements through tags.",
    severity: "medium",
    status: "fail",
    evidence: { requiredTag: "backup", tags: { owner: "finance" } },
    affectedResource: "vm-finance-02",
    remediation: "Add backup classification tags and confirm the VM is included in backup scope.",
    complianceTags: ["BCK-001", "CLD-001"],
    category: "Backups and recovery",
    provider: "azure",
    engine: "demo"
  },
  {
    checkId: "az-rg-required-tags",
    title: "Resource groups missing required tags",
    description: "Some resource groups are missing owner or environment tags.",
    severity: "low",
    status: "warning",
    evidence: { missing: [{ name: "rg-shared-prod", tags: ["owner"] }] },
    affectedResource: "rg-shared-prod",
    remediation: "Apply owner and environment tags so operational responsibility is clear.",
    complianceTags: ["CLD-001", "LOG-001"],
    category: "Cloud configuration",
    provider: "azure",
    engine: "demo"
  },
  {
    checkId: "az-diagnostic-settings",
    title: "Diagnostic settings not configured",
    description: "A production resource does not forward diagnostic logs to a central workspace.",
    severity: "high",
    status: "fail",
    evidence: { diagnosticSettings: 0, expectedDestination: "log analytics workspace" },
    affectedResource: "app-prod-api",
    remediation: "Enable diagnostic settings and retain security-relevant logs centrally.",
    complianceTags: ["LOG-001", "CLD-002"],
    category: "Logging and monitoring",
    provider: "azure",
    engine: "demo"
  },
  {
    checkId: "az-defender-status",
    title: "Defender status simulated",
    description: "Demo mode simulates Defender posture because no real tenant is connected.",
    severity: "low",
    status: "not_applicable",
    evidence: { demoMode: true },
    affectedResource: "subscription/demo",
    remediation: "Connect a real Azure service principal to check Defender status where available.",
    complianceTags: ["CLD-002"],
    category: "Cloud configuration",
    provider: "azure",
    engine: "demo"
  }
];

export function runDemoAzureScan(scanRunId = "scan_demo"): Finding[] {
  return demoResults.map((result, index) => {
    const normalized = normalizeScannerResult(result);
    return {
      id: `find_${String(index + 1).padStart(3, "0")}`,
      ...normalized,
      scanRunId,
      createdAt: new Date(Date.UTC(2026, 4, 10, 23, 21 + index)).toISOString()
    };
  });
}
