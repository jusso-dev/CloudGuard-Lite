export type AuditEvent = {
  id: string;
  action: string;
  targetType: string;
  targetId?: string;
  actor: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export const demoAuditLog: AuditEvent[] = [
  {
    id: "aud_001",
    action: "organisation.profile_completed",
    targetType: "organisation",
    targetId: "org_demo",
    actor: "Demo User",
    createdAt: "2026-05-10T23:00:00.000Z"
  },
  {
    id: "aud_002",
    action: "assessment.completed",
    targetType: "assessment",
    targetId: "asm_demo",
    actor: "Demo User",
    createdAt: "2026-05-10T23:12:00.000Z"
  },
  {
    id: "aud_003",
    action: "scan.completed",
    targetType: "scan_run",
    targetId: "scan_demo",
    actor: "Demo User",
    createdAt: "2026-05-10T23:21:00.000Z",
    metadata: { mode: "demo", provider: "azure", findings: 8 }
  },
  {
    id: "aud_004",
    action: "policy.generated",
    targetType: "policy",
    targetId: "pol_access",
    actor: "Demo User",
    createdAt: "2026-05-10T23:28:00.000Z"
  }
];
