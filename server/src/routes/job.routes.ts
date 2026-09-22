import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";

import { jobQueue } from "../services/jobQueue.js";
import { processNextJob } from "../services/jobProcessor.js";
import type { Priority, Job } from "../types/job.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "CSV file is required",
    });
  }

  const priority = req.body.priority as Priority;

  if (priority !== "HIGH" && priority !== "LOW") {
    return res.status(400).json({
      message: "Priority must be HIGH or LOW",
    });
  }

  const job: Job = {
    id: randomUUID(),
    fileName: req.file.originalname,
    filePath: req.file.path,
    priority,
    status: "QUEUED",
    progress: 0,
  };

  jobQueue.addJob(job);
  processNextJob();

  return res.status(201).json({
    message: "File added to queue",
    job,
  });
});

router.get("/:id", (req, res) => {
  const job = jobQueue.getJob(req.params.id);

  if (!job) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  return res.json({
    job,
  });
});

export default router;