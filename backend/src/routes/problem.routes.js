import { Router } from "express";

import { isLoggedIn, isAdmin } from "../middlewares/auth.middleware.js";

import {
  createProblem,
  deleteProblemById,
  getAllProblems,
  getProblemById,
  getProblemsSolvedByUser,
  getProblemsByUserId,
  updateProblemById,
  getProblemsCountSolvedByUser,
} from "../controllers/problem.controller.js";

const problemsRoutes = Router();

problemsRoutes
    .route('/create-problem')
    .post( isLoggedIn, isAdmin,createProblem);

problemsRoutes
    .route('/get-all-problems')
    .get(isLoggedIn, getAllProblems);

problemsRoutes
    .route("/get-problem/:id")
    .get(isLoggedIn, getProblemById);

problemsRoutes
    .route('/update-problem/:id')
    .patch(isLoggedIn, isAdmin, updateProblemById);

problemsRoutes
    .route('/delete-problem/:id')
    .delete(isLoggedIn, isAdmin, deleteProblemById);

problemsRoutes
  .route("/get-solved-problems")
  .get(isLoggedIn, getProblemsSolvedByUser);

problemsRoutes
    .route('/get-problems-by-user/:id')
    .get(isLoggedIn, isAdmin, getProblemsByUserId);

problemsRoutes
  .route("/get-solved-count")
  .get(isLoggedIn, getProblemsCountSolvedByUser);

export default problemsRoutes;