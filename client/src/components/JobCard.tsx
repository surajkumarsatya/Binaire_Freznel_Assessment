import type { Job } from "../types/job";

type JobCardProps = {
  job: Job;
};

function JobCard({ job }: JobCardProps) {
  return (
    <article className="job-card">
      <div className="job-top">
        <div> 
            <h3>{job.fileName}</h3>     
        </div>

        <span className={`priority-badge ${job.priority.toLowerCase()}`}>
          {job.priority}
        </span>
      </div>

      <p className="process-id"> Process ID: {job.id} </p>

      <div className="job-timeline">
        <div className="timeline-step completed">
          <span className="timeline-dot">✓</span>
          <span>File uploaded</span>
        </div>

        <div className="timeline-step completed">
          <span className="timeline-dot">✓</span>
          <span>Added to queue</span>
        </div>

        <div
          className={`timeline-step ${
            job.status === "PROCESSING" ||
            job.status === "COMPLETED"
              ? "completed"
              : "active"
          }`}
        >
          <span className="timeline-dot">
            {job.status === "QUEUED" ? "3" : "✓"}
          </span>

          <span>
            {job.status === "QUEUED"
              ? "Waiting for processing"
              : "Processing"}
          </span>
        </div>

        {job.status === "PROCESSING" && (
          <div className="timeline-progress">
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: `${job.progress}%`,
                }}
              />
            </div>

            <span>{job.progress}%</span>
          </div>
        )}

        <div
          className={`timeline-step ${
            job.status === "COMPLETED"
              ? "completed"
              : ""
          }`}
        >
          <span className="timeline-dot">
            {job.status === "COMPLETED" ? "✓" : "4"}
          </span>

          <span>
            {job.status === "COMPLETED"
              ? "Completed"
              : "Waiting for completion"}
          </span>
        </div>
      </div>

      {job.status === "COMPLETED" && (
        <div className="result">
          <span>Final result</span>
          <strong>{job.result}</strong>
        </div>
      )}

      {job.status === "FAILED" && (
        <div className="failed-message">
          Unable to process this file.
        </div>
      )}
    </article>
  );
}

export default JobCard;