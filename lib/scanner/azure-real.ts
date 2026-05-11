import { ClientSecretCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import type { ScannerCheckResult } from "@/lib/scanner/types";
import { buildProwlerExecutionErrorResult, runProwlerAzure } from "@/lib/prowler/runner";

export type AzureConnectionInput = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  subscriptionId: string;
};

export async function runRealAzureScan(
  connection: AzureConnectionInput,
  options: { useProwler?: boolean; scanRunId?: string } = {}
): Promise<ScannerCheckResult[]> {
  const credential = new ClientSecretCredential(
    connection.tenantId,
    connection.clientId,
    connection.clientSecret
  );
  const resources = new ResourceManagementClient(credential, connection.subscriptionId);
  const groups = [];

  for await (const group of resources.resourceGroups.list()) {
    groups.push(group);
  }

  const missingTags = groups.filter((group) => !group.tags?.owner || !group.tags?.environment);

  const nativeResults: ScannerCheckResult[] = [
    {
      checkId: "az-subscription-access",
      title: "Subscription access confirmed",
      description: "The scanner could authenticate and enumerate resource groups.",
      severity: "low",
      status: "pass",
      evidence: { resourceGroupCount: groups.length },
      affectedResource: `subscription/${connection.subscriptionId}`,
      remediation: "No action required. Keep least-privilege scanner access documented.",
      complianceTags: ["CLD-002"],
      category: "Cloud configuration",
      provider: "azure",
      engine: "native"
    },
    {
      checkId: "az-rg-required-tags",
      title: "Resource groups missing required tags",
      description: "Resource groups should include owner and environment tags.",
      severity: missingTags.length > 0 ? "medium" : "low",
      status: missingTags.length > 0 ? "fail" : "pass",
      evidence: {
        missingTags: missingTags.map((group) => ({ name: group.name, tags: group.tags ?? {} }))
      },
      affectedResource: "resourceGroups",
      remediation: "Apply owner and environment tags to every resource group.",
      complianceTags: ["CLD-001", "LOG-001"],
      category: "Cloud configuration",
      provider: "azure",
      engine: "native"
    },
    {
      checkId: "az-deep-resource-checks",
      title: "Deep resource checks require expanded permissions",
      description: "Storage, key vault, VM, and diagnostic checks are available in demo mode and can be expanded for production tenants.",
      severity: "low",
      status: "not_applicable",
      evidence: { reason: "portfolio-safe real scan scope" },
      affectedResource: `subscription/${connection.subscriptionId}`,
      remediation: "Grant least-privilege read permissions for the resource providers you want to scan.",
      complianceTags: ["CLD-001", "DAT-001", "LOG-001"],
      category: "Cloud configuration",
      provider: "azure",
      engine: "native"
    }
  ];

  if (!options.useProwler) {
    return nativeResults;
  }

  try {
    const prowlerResults = await runProwlerAzure({
      runId: options.scanRunId ?? `real-azure-${Date.now()}`,
      tenantId: connection.tenantId,
      clientId: connection.clientId,
      clientSecret: connection.clientSecret,
      subscriptionId: connection.subscriptionId
    });
    return [...nativeResults, ...prowlerResults];
  } catch (error) {
    return [
      ...nativeResults,
      buildProwlerExecutionErrorResult({
        provider: "azure",
        resourceId: `/subscriptions/${connection.subscriptionId}`,
        resourceName: connection.subscriptionId,
        message: error instanceof Error ? error.message : "Unknown Prowler error"
      })
    ];
  }
}
