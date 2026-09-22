import type { Job } from "../types/job.js";

class JobQueue {
  private jobs: Job[] = [];

  addJob(job: Job) {
    this.jobs.push(job);
  }

  getNextJob(): Job | undefined {
    const queuedJobs = this.jobs.filter(
      (job) => job.status === "QUEUED"
    );

    if (queuedJobs.length === 0) {
      return undefined;
    }

    // Find the first HIGH priority job
    const highPriorityJob = queuedJobs.find(
      (job) => job.priority === "HIGH"
    );

    return highPriorityJob ?? queuedJobs[0];
  }

  updateJob(id: string, updates: Partial<Job>) {
    const job = this.jobs.find((job) => job.id === id);

    if (job) {
      Object.assign(job, updates);
    }

    return job;
  }

  getJob(id: string) {
    return this.jobs.find((job) => job.id === id);
  }

  getAllJobs() {
    return this.jobs;
  }
}

export const jobQueue = new JobQueue();