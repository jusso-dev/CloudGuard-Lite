import Link from "next/link";
import { Play, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionList } from "@/components/action-list";
import {
  demoAssessmentSummary,
  demoFindings,
  demoOrganisation,
  demoScanRuns
} from "@/lib/fixtures/demo-data";
import { titleCase } from "@/lib/utils";

export default function DashboardPage() {
  const failed = demoFindings.filter((finding) => finding.status === "fail");
  const critical = demoFindings.filter((finding) => finding.severity === "critical");
  const high = demoFindings.filter((finding) => finding.severity === "high");

  return (
    <AppShell
      title="Dashboard"
      description={`${demoOrganisation.name} posture overview and current action plan.`}
      action={
        <Button asChild>
          <Link href="/scans">
            <Play className="h-4 w-4" aria-hidden />
            Run scan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Maturity score"
          value={`${demoAssessmentSummary.maturityScore}/100`}
          detail={`${demoAssessmentSummary.completedQuestions} assessment answers`}
        />
        <StatCard label="Open failed findings" value={failed.length} detail="From latest demo scan" />
        <StatCard label="Critical and high" value={critical.length + high.length} detail="Prioritise this week" />
        <StatCard label="Generated policies" value="3" detail="6 more available" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Severity breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["critical", "high", "medium", "low"] as const).map((severity) => {
              const count = demoFindings.filter((finding) => finding.severity === severity).length;
              return (
                <div key={severity} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <span className="text-sm font-medium">{titleCase(severity)}</span>
                  </div>
                  <Badge tone={severity}>{count} findings</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent scan runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoScanRuns.map((scan) => (
              <div key={scan.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Demo Azure scan</div>
                  <Badge tone="pass">{titleCase(scan.status)}</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {scan.findingCount} checks completed, mode {scan.mode}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <ActionList
          items={[
            {
              title: "Restrict public administration rule",
              detail: "Broad RDP exposure is the highest priority network risk."
            },
            {
              title: "Enable production diagnostic logging",
              detail: "Forward app and platform logs to a central workspace."
            },
            {
              title: "Test backup restore",
              detail: "Record restore evidence for one critical workload."
            },
            {
              title: "Refresh access control policy",
              detail: "Use current MFA and vendor access gaps as inputs.",
              complete: true
            }
          ]}
        />
      </div>
    </AppShell>
  );
}
