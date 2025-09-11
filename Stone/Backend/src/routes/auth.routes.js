const express = require("express");
const {
  register,
  login,
  logout,
  getUserProfile,
} = require("../controllers/auth.controller.js");

const { authMiddleware } = require("../middleware/auth.middleware.js");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authMiddleware, getUserProfile);
authRouter.get("/logout", authMiddleware, logout);

module.exports = authRouter;
