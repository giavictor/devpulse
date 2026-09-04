import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import linkRoutes from "./routes/linkRoutes";
import noteRoutes from "./routes/noteRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Test route
app.get("/", (_req, res) => {
  res.json({
    message: "DevPulse API is running",
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

// Saved Links API
app.use("/api/links", linkRoutes);

// Notes API
app.use("/api/notes", noteRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});