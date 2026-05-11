import { AppShell } from "@/components/app-shell";
import { FindingTable } from "@/components/finding-table";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoFindings } from "@/lib/fixtures/demo-data";
import { titleCase } from "@/lib/utils";

export default function FindingsPage() {
  const failCount = demoFindings.filter((finding) => finding.status === "fail").length;
  const passCount = demoFindings.filter((finding) => finding.status === "pass").length;
  const warningCount = demoFindings.filter((finding) => finding.status === "warning").length;
  const byCategory = Array.from(new Set(demoFindings.map((finding) => finding.category))).map(
    (category) => ({
      category,
      count: demoFindings.filter((finding) => finding.category === category).length
    })
  );

  return (
    <AppShell
      title="Findings"
      description="Filter and review normalized scanner results, evidence, and mapped controls."
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Total checks" value={demoFindings.length} />
        <StatCard label="Failed" value={failCount} />
        <StatCard label="Warnings" value={warningCount} />
        <StatCard label="Passed" value={passCount} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {["severity", "provider", "scan run", "status", "category", "compliance tag"].map(
            (filter) => (
              <Button key={filter} variant="secondary" size="sm">
                {titleCase(filter)}
              </Button>
            )
          )}
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {byCategory.map((item) => (
          <div key={item.category} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <span className="text-sm font-medium">{item.category}</span>
            <Badge>{item.count}</Badge>
          </div>
        ))}
      </div>

      <FindingTable findings={demoFindings} />
    </AppShell>
  );
}
