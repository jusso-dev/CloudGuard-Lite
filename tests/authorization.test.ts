import { describe, expect, it } from "vitest";
import {
  assertOrganisationAccess,
  canAccessOrganisation,
  canEditResource,
  canManageOrganisation
} from "@/lib/auth/authorization";

describe("organisation authorization", () => {
  it("checks organisation membership", () => {
    expect(canAccessOrganisation([{ organisationId: "org_1", role: "viewer" }], "org_1")).toBe(true);
    expect(canAccessOrganisation([{ organisationId: "org_1", role: "viewer" }], "org_2")).toBe(false);
  });

  it("checks role capabilities", () => {
    expect(canManageOrganisation("owner")).toBe(true);
    expect(canManageOrganisation("contributor")).toBe(false);
    expect(canEditResource("contributor")).toBe(true);
  });

  it("throws when access is denied", () => {
    expect(() => assertOrganisationAccess([], "org_1")).toThrow("Organisation access denied");
  });
});
