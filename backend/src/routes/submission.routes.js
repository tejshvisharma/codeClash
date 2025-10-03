import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllSubmissions,
  getSubmissionsByProblemId,
  getSubmissionsCountForProblem,
} from "../controllers/submission.controller.js";

const submissionRoutes = Router();

submissionRoutes
    .route("/get-all-submissions")
    .get(isLoggedIn, getAllSubmissions);

submissionRoutes
    .route("/get-submission/:problemId")
    .get(isLoggedIn, getSubmissionsByProblemId);

submissionRoutes
    .route("/get-submissions-count/:problemId")
    .get(isLoggedIn, getSubmissionsCountForProblem);

export default submissionRoutes;
