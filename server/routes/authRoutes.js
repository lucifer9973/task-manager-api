const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ------------------ REGISTER ------------------
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registration attempt with data:", { name: req.body.name, email: req.body.email });
    
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log("❌ Validation failed - missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("✅ Input validation passed");

    // check if user already exists
    console.log("🔍 Checking if user exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("✅ User does not exist, proceeding with registration");

    // hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully");

    // create new user
    console.log("👤 Creating new user...");
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    console.log("💾 Saving user to database...");
    await newUser.save();
    console.log("✅ User saved successfully");

    // Create JWT token for automatic login after registration
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(201).json({ 
      message: "User registered successfully",
      token, // This is the key addition
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    console.error("❌ Error stack:", err.stack);
    
    // Check if it's a MongoDB connection error
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
      return res.status(503).json({ 
        message: "Database connection error. Please try again later.",
        error: "MongoDB connection failed"
      });
    }
    
    // Check for validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err);
    // Check if it's a MongoDB connection error
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
      return res.status(503).json({ 
        message: "Database connection error. Please try again later.",
        error: "MongoDB connection failed"
      });
    }
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// ------------------ GET ALL USERS (DEBUGGING) ------------------
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("Fetch error:", err);
    // Check if it's a MongoDB connection error
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
      return res.status(503).json({ 
        message: "Database connection error. Please try again later.",
        error: "MongoDB connection failed"
      });
    }
    res.status(500).json({ 
      message: "Error fetching users", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;