const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
require("dotenv").config();

const app = express();

// ====================
// Middleware
// ====================
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both Vite and standard React ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Session for Google OAuth
app.use(cookieSession({
  name: "session",
  keys: [process.env.SESSION_SECRET || "COOKIE_SECRET"], // Fallback if env missing
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: false, // Set to true if using HTTPS in production
  httpOnly: true,
  sameSite: 'lax'
}));

// ====================
// Database & Models
// ====================
const dbConfig = require("./config/db.config");
const db = require("./src/models");
const Role = db.role;

const dbURI = process.env.MONGODB_URI || `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connected to MongoDB.");
  initial(); // ✅ CRITICAL: Runs the setup function to create roles
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// ====================
// Passport Config
// ====================
const passport = require("./config/passport.config");
app.use(passport.initialize());
app.use(passport.session());

// ====================
// Routes
// ====================

// Simple API Check
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CodeReview SaaS API." });
});

// Load Routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/google.routes")(app); // ✅ Google Auth Routes

// Code Analysis Routes (Using Express Router pattern)
// Ensure your code.routes.js exports a Router: 'module.exports = router;'
app.use("/api/code", require("./src/routes/code.routes"));

// ====================
// Global Error Handler
// ====================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ====================
// Server Start
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// ====================
// Helper: Initialize Roles
// ====================
async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      console.log("No roles found. Initializing...");
      
      await new Role({ name: "user" }).save();
      console.log("added 'user' to roles collection");

      await new Role({ name: "moderator" }).save();
      console.log("added 'moderator' to roles collection");

      await new Role({ name: "admin" }).save();
      console.log("added 'admin' to roles collection");
    }
  } catch (err) {
    console.error("Error initializing roles:", err);
  }
}