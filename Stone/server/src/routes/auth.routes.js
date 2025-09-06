import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
} from "../controllers/auth.ctrl.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, getUserProfile);

router.get("/logout", authMiddleware, logout);

export default router;
