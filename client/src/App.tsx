import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/jobs";

type JobStatus =
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

type Job = {
  id: string;
  fileName: string;
  filePath: string;
  priority: "HIGH" | "LOW";
  status: JobStatus;
  progress: number;
  result?: number;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [priority, setPriority] = useState<"HIGH" | "LOW">("HIGH");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();

    formData.append("file", file);
    formData.append("priority", priority);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setJobs((previousJobs) => [data.job, ...previousJobs]);

      setFile(null);

      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const processingJobs = jobs.filter(
      (job) =>
        job.status === "QUEUED" ||
        job.status === "PROCESSING"
    );

    if (processingJobs.length === 0) {
      return;
    }

    const interval = setInterval(async () => {
      const updatedJobs = await Promise.all(
        jobs.map(async (job) => {
          if (
            job.status !== "QUEUED" &&
            job.status !== "PROCESSING"
          ) {
            return job;
          }

          try {
            const response = await fetch(
              `${API_URL}/${job.id}`
            );

            if (!response.ok) {
              return job;
            }

            const data = await response.json();

            return data.job;
          } catch {
            return job;
          }
        })
      );

      setJobs(updatedJobs);
    }, 1000);

    return () => clearInterval(interval);
  }, [jobs]);

  return (
    <main className="app">
      <header className="header">
        <div>
          <h2>Multi-user Queueing System</h2>
        </div>
      </header>

      <section className="upload-section">
        <div className="upload-card">
          <h2>Upload CSV file</h2>

          <label htmlFor="file-input" className="file-picker">
            {file ? file.name : "Choose CSV file"}
          </label>

          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            hidden
          />

          {file && (
            <div className="selected-file">
              <span>{file.name}</span>
              <span>
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          <div className="priority-section">
            <p className="label">Priority</p>

            <div className="priority-options">
              <button
                type="button"
                className={
                  priority === "HIGH"
                    ? "priority active high"
                    : "priority"
                }
                onClick={() => setPriority("HIGH")}
              >
                High
              </button>

              <button
                type="button"
                className={
                  priority === "LOW"
                    ? "priority active low"
                    : "priority"
                }
                onClick={() => setPriority("LOW")}
              >
                Low
              </button>
            </div>
          </div>

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload & Queue"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>
      </section>

      <section className="queue-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">JOBS</p>
            <h2>Processing Queue</h2>
          </div>

          <span className="job-count">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No files in the queue yet.</p>
            <span>Upload a CSV to create your first job.</span>
          </div>
        ) : (
          <div className="jobs">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-top">
                  <div>
                    <h3>{job.fileName}</h3>
                    <p className="process-id">
                      Process ID: {job.id}
                    </p>
                  </div>

                  <span
                    className={`priority-badge ${job.priority.toLowerCase()}`}
                  >
                    {job.priority}
                  </span>
                </div>

                <div className="job-timeline">
                  <div className="timeline-step completed">
                    <span className="timeline-dot">✓</span>
                    <span>File uploaded</span>
                  </div>

                  <div
                    className={`timeline-step ${
                      job.status !== "QUEUED" ||
                      job.status === "QUEUED"
                        ? "completed"
                        : ""
                    }`}
                  >
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
                      job.status === "COMPLETED" ? "completed" : ""
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

                {job.status === "PROCESSING" && (
                  <div className="progress-wrapper">
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
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;