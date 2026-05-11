import Link from "next/link";
import { Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAnswers, demoFindings, demoOrganisation } from "@/lib/fixtures/demo-data";
import { generateMarkdownReport } from "@/lib/reports/markdown";

export default function ReportsPage() {
  const report = generateMarkdownReport({
    organisation: demoOrganisation,
    answers: demoAnswers,
    findings: demoFindings
  });

  return (
    <AppShell
      title="Reports"
      description="Export a simple Markdown report with profile, assessment, scan, controls, and action plan."
      action={
        <Button asChild>
          <Link href="/api/reports?format=markdown" target="_blank" rel="noreferrer">
            <Download className="h-4 w-4" aria-hidden />
            Export Markdown
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Current posture report</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[720px] overflow-auto rounded-md border bg-muted/50 p-4 text-xs leading-5">
            {report}
          </pre>
        </CardContent>
      </Card>
    </AppShell>
  );
}
