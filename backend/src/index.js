import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routes
import authRoutes from "./routes/auth.routes.js";
import problemsRoutes from "./routes/problem.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("CodeClash Backend is running🔥!");
});

// Handle Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemsRoutes);




const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
