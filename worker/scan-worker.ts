import { Worker } from "bullmq";
import IORedis from "ioredis";
import { runProviderScan } from "@/lib/scanner/provider-dispatch";
import type { ScanJobPayload } from "@/lib/queue/scan-queue";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null
});

const worker = new Worker<ScanJobPayload>(
  "cloud-scans",
  async (job) => {
    if (job.data.mode === "demo") {
      const findings = await runProviderScan({
        provider: "azure",
        mode: "demo",
        scanRunId: job.data.scanRunId
      });
      console.log(
        JSON.stringify({
          scanRunId: job.data.scanRunId,
          organisationId: job.data.organisationId,
          findings: findings.length,
          status: "completed"
        })
      );
      return { findings: findings.length };
    }

    throw new Error(
      "Real Prowler scan worker requires encrypted connection lookup. The provider modules are implemented; persistence wiring should decrypt the selected connection server-side."
    );
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Scan job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Scan job ${job?.id ?? "unknown"} failed`, error);
});
