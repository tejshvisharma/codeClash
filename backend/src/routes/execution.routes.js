import { Router } from "express";

import { executeCode } from "../controllers/execution.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import requestId from "../middlewares/requestId.middleware.js";

const executionRoutes = Router();

executionRoutes
    .route("/")
    .post(isLoggedIn, executeCode);


export default executionRoutes;