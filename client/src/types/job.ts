export type Priority = "HIGH" | "LOW";

export type JobStatus =
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type Job = {
  id: string;
  fileName: string;
  filePath: string;
  priority: Priority;
  status: JobStatus;
  progress: number;
  result?: number;
};

export type SelectedFile = {
  file: File;
  priority: Priority;
};