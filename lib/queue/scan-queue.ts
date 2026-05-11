import { Queue } from "bullmq";
import IORedis from "ioredis";

export type ScanJobPayload = {
  scanRunId: string;
  organisationId: string;
  connectionId?: string;
  mode: "demo" | "real";
  provider: "azure" | "aws" | "microsoft365";
  useProwler?: boolean;
};

let queue: Queue<ScanJobPayload> | undefined;

export function getScanQueue() {
  if (!queue) {
    const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: null
    });
    queue = new Queue<ScanJobPayload>("cloud-scans", { connection });
  }

  return queue;
}
