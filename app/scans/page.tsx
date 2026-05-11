import { Play } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoScanRuns } from "@/lib/fixtures/demo-data";
import { titleCase } from "@/lib/utils";

export default function ScansPage() {
  return (
    <AppShell
      title="Scan runs"
      description="Start a demo Azure scan or queue a real scan for an encrypted connection."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Start scan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form action="/api/demo-scan" method="post">
              <Button className="w-full">
                <Play className="h-4 w-4" aria-hidden />
                Run demo Azure scan
              </Button>
            </form>
            <form action="/api/scans" method="post">
              <Button variant="secondary" className="w-full">
                Queue real Azure scan
              </Button>
            </form>
            <p className="text-sm text-muted-foreground">
              Demo mode stores realistic findings without requiring cloud credentials.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoScanRuns.map((scan) => (
              <div key={scan.id} className="grid gap-2 rounded-md border p-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="font-medium">Azure posture scan</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Started {new Date(scan.startedAt).toLocaleString()} and completed{" "}
                    {new Date(scan.completedAt).toLocaleString()}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {scan.findingCount} normalized scanner results
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge>{titleCase(scan.mode)}</Badge>
                  <Badge tone="pass">{titleCase(scan.status)}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
