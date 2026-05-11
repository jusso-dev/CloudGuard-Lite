import { cookies } from "next/headers";

export const demoUser = {
  id: "usr_demo",
  email: "demo@cloudguard.local",
  name: "Demo User",
  memberships: [{ organisationId: "org_demo", role: "owner" as const }]
};

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("cloudguard_session")?.value;
  if (!session) {
    return demoUser;
  }
  return demoUser;
}
