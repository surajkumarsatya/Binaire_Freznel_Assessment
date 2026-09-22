import { Worker } from "worker_threads";
import { jobQueue } from "./jobQueue.js";

let isProcessing = false;

export function processNextJob() {
  if (isProcessing) {
    return;
  }

  const job = jobQueue.getNextJob();

  if (!job) {
    return;
  }

  isProcessing = true;

  jobQueue.updateJob(job.id, {
    status: "PROCESSING",
  });

  const worker = new Worker(
    new URL("../workers/csv.worker.ts", import.meta.url),
    {
      execArgv: ["--import", "tsx/esm"],
      workerData: {
        filePath: job.filePath,
      },
    }
  );

  worker.on("message", (message) => {
    if (message.type === "progress") {
        jobQueue.updateJob(job.id, {
        progress: message.progress,
        });

        return;
    }

    if (message.type === "completed") {
        jobQueue.updateJob(job.id, {
        status: "COMPLETED",
        progress: 100,
        result: message.total,
        });

        isProcessing = false;
        processNextJob();
    }

    if (message.type === "error") {
        jobQueue.updateJob(job.id, {
        status: "FAILED",
        });

        isProcessing = false;
        processNextJob();
    }
    });

  worker.on("error", (error) => {
    console.error("Worker error:", error);

    jobQueue.updateJob(job.id, {
      status: "FAILED",
    });

    isProcessing = false;

    processNextJob();
  });
}