import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAuditLog } from "@/lib/audit/audit-log";

export default function AuditPage() {
  return (
    <AppShell
      title="Audit log"
      description="Important posture actions are recorded for organisation-scoped traceability."
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-scroll overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                </tr>
              </thead>
              <tbody>
                {demoAuditLog.map((event) => (
                  <tr key={event.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge>{event.action}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {event.targetType} {event.targetId ? `/${event.targetId}` : ""}
                    </td>
                    <td className="px-4 py-3">{event.actor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
