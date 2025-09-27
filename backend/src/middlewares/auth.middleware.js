import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    let token;

    // 1. Cookie first
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    // 2. Fallback to Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized - Invalid or expired token",
        });
    }

    // Fetch user
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, image: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in auth middleware:", err);
    }
    return res
      .status(500)
      .json({ success: false, message: "Error in authentication middleware" });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const user = db.user.findUnique({ where: { id: userId } });
      if (user && user.role === "ADMIN") {
        next();
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized - Admin access required" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not authenticated" });
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in Authorization middleware:", err);
    }
    return res
      .status(500)
      .json({ success: false, message: "Error in Authorization middleware" });
  }
};
