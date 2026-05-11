import { NextResponse } from "next/server";
import { demoAnswers, demoFindings, demoOrganisation } from "@/lib/fixtures/demo-data";
import { generatePolicyTemplate, policyCatalog, type PolicyType } from "@/lib/policies/templates";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") as PolicyType | null;
  const policy = policyCatalog.find((item) => item.type === type);
  if (!policy || !type) {
    return NextResponse.json({ error: "Unknown policy type" }, { status: 404 });
  }

  const content = generatePolicyTemplate({
    type,
    organisation: demoOrganisation,
    answers: demoAnswers,
    findings: demoFindings
  });

  return new NextResponse(content, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="${policy.type}.md"`
    }
  });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const type = form.get("type");
  const content = form.get("content");
  if (typeof type !== "string" || typeof content !== "string") {
    return NextResponse.json({ error: "Invalid policy update" }, { status: 400 });
  }

  return NextResponse.json({
    id: `pol_${type}`,
    type,
    version: 4,
    contentLength: content.length,
    audit: "policy.edited"
  });
}
