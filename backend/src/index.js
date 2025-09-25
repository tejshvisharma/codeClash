import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("CodeClash Backend is running🔥!");
});

app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 CodeClash Backend running on port ${PORT}`);
});
