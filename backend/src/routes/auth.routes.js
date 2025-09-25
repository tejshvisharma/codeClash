import express from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", isLoggedIn, logout);

authRoutes.get("/me", isLoggedIn, me);
// 
export default authRoutes;