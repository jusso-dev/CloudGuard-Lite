import { describe, expect, it } from "vitest";
import { adaptProwlerOcsfFindings } from "@/lib/prowler/adapter";

describe("adaptProwlerOcsfFindings", () => {
  it("maps OCSF findings to CloudGuard scanner results", () => {
    const results = adaptProwlerOcsfFindings([
      {
        check_id: "storage_accounts_blob_public_access_disabled",
        status: "FAIL",
        severity: "HIGH",
        cloud: { provider: "azure", account: { uid: "sub-1", name: "Subscription" } },
        resources: [{ uid: "/subscriptions/sub-1/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/st1", name: "st1" }],
        finding_info: { title: "Storage public access disabled", desc: "Blob public access should be disabled." },
        remediation: { desc: "Disable public blob access." }
      }
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].engine).toBe("prowler");
    expect(results[0].provider).toBe("azure");
    expect(results[0].status).toBe("fail");
    expect(results[0].severity).toBe("high");
    expect(results[0].complianceTags).toContain("CLD-001");
  });
});
