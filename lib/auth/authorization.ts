export type Role = "owner" | "admin" | "contributor" | "viewer";

const roleRank: Record<Role, number> = {
  viewer: 1,
  contributor: 2,
  admin: 3,
  owner: 4
};

export function canAccessOrganisation(
  memberships: Array<{ organisationId: string; role: Role }>,
  organisationId: string
) {
  return memberships.some((membership) => membership.organisationId === organisationId);
}

export function canManageOrganisation(role: Role) {
  return roleRank[role] >= roleRank.admin;
}

export function canEditResource(role: Role) {
  return roleRank[role] >= roleRank.contributor;
}

export function assertOrganisationAccess(
  memberships: Array<{ organisationId: string; role: Role }>,
  organisationId: string
) {
  if (!canAccessOrganisation(memberships, organisationId)) {
    throw new Error("Organisation access denied");
  }
}
