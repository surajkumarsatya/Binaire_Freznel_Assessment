import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import { parse } from "csv-parse";

const filePath = workerData.filePath;

let total = 0;
let processedBytes = 0;

const fileSize = fs.statSync(filePath).size;

const fileStream = fs.createReadStream(filePath);

fileStream.on("data", (chunk: Buffer) => {
  processedBytes += chunk.length;

  const progress = Math.min(
    99,
    Math.round((processedBytes / fileSize) * 100)
  );

  parentPort?.postMessage({
    type: "progress",
    progress,
  });
});

const parser = fileStream.pipe(
  parse({
    skip_empty_lines: true,
  })
);

parser.on("data", (row: string[]) => {
  for (const value of row) {
    const number = Number(value);

    if (!Number.isNaN(number)) {
      total += number;
    }
  }
});

parser.on("end", () => {
  parentPort?.postMessage({
    type: "completed",
    total,
  });
});

parser.on("error", (error: Error) => {
  parentPort?.postMessage({
    type: "error",
    error: error.message,
  });
});