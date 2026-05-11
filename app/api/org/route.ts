import { NextResponse } from "next/server";
import { organisationProfileSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = organisationProfileSchema.safeParse({
    name: form.get("name"),
    industry: form.get("industry"),
    employeeCount: form.get("employeeCount"),
    cloudProviders: ["azure"],
    usesMicrosoft365: form.has("usesMicrosoft365"),
    handlesSensitive: form.has("handlesSensitive"),
    hasRemoteWorkers: form.has("hasRemoteWorkers"),
    hasContractors: form.has("hasContractors"),
    backupApproach: form.get("backupApproach"),
    mfaApproach: form.get("mfaApproach"),
    deviceManagement: form.get("deviceManagement"),
    incidentMaturity: form.get("incidentMaturity")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/assessment", request.url), 303);
}
