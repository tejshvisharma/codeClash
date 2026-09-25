import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllSubmissions,
  getSubmissionsByProblemId,
  getSubmissionsCountForProblem,
  getSubmissionsForProblem,
  getSuccessRateForProblem,
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

submissionRoutes
    .route("/problem/:problemId")
    .get(isLoggedIn, getSubmissionsForProblem);

submissionRoutes
    .route("/get-success-rate/:problemId")
    .get( getSuccessRateForProblem);


export default submissionRoutes;
