import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routes
import authRoutes from "./routes/auth.routes.js";
import problemsRoutes from "./routes/problem.routes.js";
import executionRoutes from "./routes/execution.routes.js";
import requestId from "./middlewares/requestId.middleware.js";
import submissionsRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import runCodeRoutes from "./routes/runcode.routes.js";
import profileRoutes from "./routes/profile.routes.js";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_BASE_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie", "*"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestId);

// Test route
app.get("/", (req, res) => {
  res.send("CodeClash Backend is running🔥!");
});

// Handle Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemsRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submissions", submissionsRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/runcode", runCodeRoutes);
app.use("/api/v1/profile", profileRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
