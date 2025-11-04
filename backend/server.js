// server.js
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
  origin: "http://localhost:3000", // React frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Session for Google OAuth
app.use(cookieSession({
  name: "session",
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: false, // set true in production with HTTPS
  httpOnly: true,
  sameSite: 'lax'
}));

// ====================
// Passport (Google OAuth)
// ====================
const passport = require("./config/passport.config"); // ← Corrected path (config/ in root)
app.use(passport.initialize());
app.use(passport.session());

// ====================
// Database Connection
// ====================
const dbConfig = require("./config/db.config");
const dbURI = process.env.MONGODB_URI || `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;

mongoose.connect(dbURI)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initializeRoles();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ====================
// Models
// ====================
const db = require("./src/models");
const Role = db.role;

// ====================
// Initialize Default Roles
// ====================
async function initializeRoles() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      const roles = ["user", "moderator", "admin"];
      for (const name of roles) {
        await new Role({ name }).save();
        console.log(`Added '${name}' to roles collection`);
      }
    }
  } catch (err) {
    console.error("Error initializing roles:", err);
  }
}

// ====================
// Routes
// ====================

// Home / API Info
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to JWT + Google OAuth API",
    isAuthenticated: req.isAuthenticated?.() || false,
    user: req.user ? {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    } : null,
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        signin: "POST /api/auth/signin",
        refreshtoken: "POST /api/auth/refreshtoken",
        signout: "POST /api/auth/signout",
        google: "GET /api/auth/google",
        logout: "GET /api/auth/logout"
      },
      test: {
        public: "GET /api/test/all",
        user: "GET /api/test/user",
        mod: "GET /api/test/mod",
        admin: "GET /api/test/admin"
      },
      profile: "GET /api/user/profile"
    }
  });
});

// Load Routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/google.routes")(app);  // Google OAuth Routes
require("./src/routes/code.routes")(app);
// ====================
// 404 Handler
// ====================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ====================
// Error Handler
// ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ====================
// Start Server
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});