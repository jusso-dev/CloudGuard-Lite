import { NextResponse } from "next/server";
import { getScanQueue } from "@/lib/queue/scan-queue";

export async function POST() {
  const payload = {
    scanRunId: `scan_${Date.now()}`,
    organisationId: "org_demo",
    mode: "demo" as const,
    provider: "azure" as const,
    useProwler: true
  };

  if (process.env.REDIS_URL) {
    await getScanQueue().add("azure-scan", payload);
  }

  return NextResponse.json({
    status: process.env.REDIS_URL ? "queued" : "demo_queue_skipped",
    payload
  });
}
