import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoOrganisation } from "@/lib/fixtures/demo-data";

export default function SetupPage() {
  return (
    <AppShell
      title="Organisation setup"
      description="Profile details influence recommended actions and deterministic policy templates."
    >
      <form action="/api/org" method="post" className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <CardTitle>Organisation profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organisation name</Label>
              <Input id="name" name="name" defaultValue={demoOrganisation.name} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" defaultValue={demoOrganisation.industry} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employees</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  defaultValue={demoOrganisation.employeeCount}
                />
              </div>
            </div>
            <div className="grid gap-3 text-sm">
              {[
                ["usesMicrosoft365", "Uses Microsoft 365", demoOrganisation.usesMicrosoft365],
                ["handlesSensitive", "Handles sensitive data", demoOrganisation.handlesSensitive],
                ["hasRemoteWorkers", "Has remote workers", demoOrganisation.hasRemoteWorkers],
                ["hasContractors", "Uses contractors", demoOrganisation.hasContractors]
              ].map(([name, label, checked]) => (
                <label key={String(name)} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={String(name)}
                    defaultChecked={Boolean(checked)}
                    className="h-4 w-4 rounded border"
                  />
                  {label}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="hidden" name="cloudProviders" value="azure" />
            <div className="space-y-2">
              <Label htmlFor="backupApproach">Backup approach</Label>
              <Textarea
                id="backupApproach"
                name="backupApproach"
                defaultValue={demoOrganisation.backupApproach}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mfaApproach">MFA approach</Label>
              <Textarea id="mfaApproach" name="mfaApproach" defaultValue={demoOrganisation.mfaApproach} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deviceManagement">Device management</Label>
                <Textarea
                  id="deviceManagement"
                  name="deviceManagement"
                  defaultValue={demoOrganisation.deviceManagement}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentMaturity">Incident response maturity</Label>
                <Textarea
                  id="incidentMaturity"
                  name="incidentMaturity"
                  defaultValue={demoOrganisation.incidentMaturity}
                />
              </div>
            </div>
            <Button>Save profile</Button>
          </CardContent>
        </Card>
      </form>
    </AppShell>
  );
}
