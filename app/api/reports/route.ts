import { NextResponse } from "next/server";
import { demoAnswers, demoFindings, demoOrganisation } from "@/lib/fixtures/demo-data";
import { generateMarkdownReport } from "@/lib/reports/markdown";

export async function GET() {
  const report = generateMarkdownReport({
    organisation: demoOrganisation,
    answers: demoAnswers,
    findings: demoFindings
  });

  return new NextResponse(report, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": "attachment; filename=\"cloudguard-lite-report.md\""
    }
  });
}
