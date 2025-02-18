const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, mobile, email, password, role } = req.body;

    const newUser = new User({ name, mobile, email, password, role });
    await newUser.save();

    const token = generateToken({ userId: newUser._id, role: newUser.role });
    res.status(201).json({ message: "User registered successfully", token, role: newUser.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user._id, role: user.role });
    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Protected route example
router.get("/dashboard", jwtAuthMiddleware, async (req, res) => {
  res.json({ message: "Welcome to the dashboard", user: req.user });
});

module.exports = router;