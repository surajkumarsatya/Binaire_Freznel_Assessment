import type { Job } from "../types/job";
import JobCard from "./JobCard";

type QueueSectionProps = {
  jobs: Job[];
};

function QueueSection({ jobs }: QueueSectionProps) {
  return (
    <section className="queue-section">
      <div className="section-heading">
        <div>
          <h2>Processing Queue</h2>
        </div>

        <span className="job-count">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>No files in the queue yet.</p>

          <span>
            Upload a CSV to create your first job.
          </span>
        </div>
      ) : (
        <div className="jobs">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}

export default QueueSection;