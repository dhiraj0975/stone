const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByEmail, findById, createUser } = require("../models/user.model");

// Register
const register = (req, res) => {
  const { name, email, password } = req.body;

  findByEmail(email, (err, existingUser) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err.message });

      createUser(name, email, hashedPassword, "Viewer", (err, userId) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered successfully", userId });
      });
    });
  });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const isProd = process.env.NODE_ENV === "production";
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  });
};

// Profile
const getUserProfile = (req, res) => {
  findById(req.user.id, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  });
};

// Logout
const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  getUserProfile,
  logout,
};
