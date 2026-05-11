import { Cloud, KeyRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ConnectionsPage() {
  return (
    <AppShell
      title="Cloud connections"
      description="Add least-privilege cloud credentials for real scans, or use demo mode without secrets."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add Azure service principal</CardTitle>
            <CardDescription>
              Secrets are encrypted server-side with the configured environment encryption key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/connections" method="post" className="space-y-4">
              {[
                ["name", "Connection name", "Azure production reader"],
                ["tenantId", "Tenant ID", "00000000-0000-0000-0000-000000000000"],
                ["clientId", "Client ID", "11111111-1111-1111-1111-111111111111"],
                ["subscriptionId", "Subscription ID", "22222222-2222-2222-2222-222222222222"]
              ].map(([name, label, placeholder]) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} name={name} placeholder={placeholder} />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client secret</Label>
                <Input id="clientSecret" name="clientSecret" type="password" placeholder="Use a demo or least-privilege secret" />
              </div>
              <Button>
                <KeyRound className="h-4 w-4" aria-hidden />
                Save encrypted connection
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configured connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4 rounded-md border p-4">
                <div className="flex gap-3">
                  <Cloud className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <div className="font-medium">Demo Azure connection</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      No real credentials stored. Runs realistic demo posture checks.
                    </div>
                  </div>
                </div>
                <Badge tone="pass">Ready</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prowler providers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                ["Azure", "Service principal, CIS Azure profile, native checks plus Prowler"],
                ["AWS", "Access key or assumed role path, CIS AWS profile via Prowler"],
                ["Microsoft 365", "Graph app registration, CIS M365 profile via Prowler"]
              ].map(([provider, detail]) => (
                <div key={provider} className="rounded-md border p-3">
                  <div className="text-sm font-medium">{provider}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Credential handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Use a least-privilege app registration with read-only permissions for portfolio testing.</p>
              <p>Raw secrets are never returned to the browser after submission.</p>
              <p>AWS and Microsoft 365 connection models are reserved as stretch modules.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
