import { NextResponse } from "next/server";
import { runDemoAzureScan } from "@/lib/scanner/demo-azure";

export async function POST(request: Request) {
  const findings = runDemoAzureScan(`scan_${Date.now()}`);
  return NextResponse.redirect(new URL(`/findings?generated=${findings.length}`, request.url), 303);
}
