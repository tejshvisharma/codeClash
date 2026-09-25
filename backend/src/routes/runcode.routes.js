import { Router } from "express";
import { executeCustomCode } from "../controllers/runcode.controller.js";

const runCodeRoutes = Router(); 

runCodeRoutes
    .route("/")
    .post(executeCustomCode);

export default runCodeRoutes;