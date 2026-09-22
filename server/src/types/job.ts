export type Priority = "HIGH" | "LOW";

export type JobStatus = | "UPLOADED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
export interface Job {
  id: string;
  fileName: string;
  filePath: string;
  priority: Priority;
  status: JobStatus;
  progress: number;
  result?: number;
}