import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoControlMappings } from "@/lib/fixtures/demo-data";
import { titleCase } from "@/lib/utils";

export default function ControlsPage() {
  return (
    <AppShell
      title="Controls"
      description="Generic internal controls mapped to assessment answers and cloud findings."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {demoControlMappings.map((control) => (
          <Card key={control.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>
                    {control.id}: {control.title}
                  </CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{control.description}</p>
                </div>
                <Badge tone={control.status === "implemented" ? "pass" : "warning"}>
                  {titleCase(control.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Related findings</div>
                  <div className="mt-1 text-lg font-semibold">{control.relatedFindings.length}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Assessment answers</div>
                  <div className="mt-1 text-lg font-semibold">
                    {control.relatedAssessmentQuestionIds.length}
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Next action: </span>
                <span className="text-muted-foreground">{control.recommendedAction}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
