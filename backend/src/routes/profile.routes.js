import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getUserProfile,
  getActivityCalendar,
  getLanguageStats,
  getRecentActivity,
  getSubmissionTrends,
  getProblemStats,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", isLoggedIn, getUserProfile);
router.get("/activity", isLoggedIn, getActivityCalendar);
router.get("/languages", isLoggedIn, getLanguageStats);
router.get("/recent", isLoggedIn, getRecentActivity);
router.get("/trends", isLoggedIn, getSubmissionTrends);
router.get("/problem-stats", isLoggedIn, getProblemStats);

export default router;
