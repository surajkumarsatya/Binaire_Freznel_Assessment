import express from "express";
import cors from "cors";
import jobRoutes from "./routes/job.routes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Binaire Freznel Assessment Server is running",
  });
});

app.use("/api/jobs", jobRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});