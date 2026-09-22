import { useEffect, useState } from "react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import QueueSection from "./components/QueueSection";
import type { Job, SelectedFile } from "./types/job";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/jobs";

function App() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.name.toLowerCase().endsWith(".csv")
    );

    if (invalidFile) {
      setError("Only CSV files are allowed.");
      setFiles([]);
      return;
    }

    setError("");

    setFiles(
      selectedFiles.map((file) => ({
        file,
        priority: "HIGH",
      }))
    );
  };

  const handlePriorityChange = (
    fileName: string,
    priority: "HIGH" | "LOW"
  ) => {
    setFiles((previousFiles) =>
      previousFiles.map((item) =>
        item.file.name === fileName
          ? {
              ...item,
              priority,
            }
          : item
      )
    );
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one CSV file.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      for (const item of files) {
        const formData = new FormData();

        formData.append("file", item.file);
        formData.append("priority", item.priority);

        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Upload failed.");
        }

        setJobs((previousJobs) => [
          data.job,
          ...previousJobs,
        ]);
      }

      setFiles([]);

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
      <Header />

      <UploadSection
        files={files}
        uploading={uploading}
        error={error}
        onFileChange={handleFileChange}
        onPriorityChange={handlePriorityChange}
        onUpload={handleUpload}
      />

      <QueueSection jobs={jobs} />
    </main>
  );
}

export default App;