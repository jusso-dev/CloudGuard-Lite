import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Deployment, security, and provider configuration for the demo workspace."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Database", "PostgreSQL via Prisma"],
              ["Queue", "Redis and BullMQ"],
              ["Encryption", "AES-256-GCM environment key"],
              ["Prowler", `Pinned ${process.env.PROWLER_VERSION ?? "3.11.3"}`],
              ["LLM mode", process.env.OPENAI_API_KEY ? "Configured" : "Template-only"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm font-medium">{label}</span>
                <Badge>{value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>All app workflows are organisation-scoped and designed for server-side authorization checks.</p>
            <p>Cloud secrets are encrypted before persistence and are never returned to client routes.</p>
            <p>Prowler runs in the worker as a subprocess and emits normalized findings from OCSF JSON output.</p>
            <p>Demo mode avoids cloud credentials so reviewers can run the main workflow locally.</p>
            <p>Generated content is internal guidance and should be reviewed before adoption.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
