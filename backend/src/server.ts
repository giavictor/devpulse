import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import linkRoutes from "./routes/linkRoutes";
import noteRoutes from "./routes/noteRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://devpulse-seven-sigma.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin and allowed frontend URLs
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
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
  console.log(`Server running on port ${PORT}`);
});