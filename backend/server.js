const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ====================
// Middleware
// ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// Config Imports
// ====================
const authConfig = require("./config/auth.config");
const dbConfig = require("./config/db.config");

// ====================
// Database Connection
// ====================
const dbURI = process.env.MONGODB_URI || `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;

mongoose
  .connect(dbURI)  // Removed deprecated options
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initializeRoles();  // Initialize default roles
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ====================
// Models
// ====================
const db = require("./src/models");
const Role = db.role;

// ====================
// Initialize Default Roles (Async/Await)
// ====================
async function initializeRoles() {
  try {
    const count = await Role.estimatedDocumentCount();  // No callback, use await
    if (count === 0) {
      const roles = ["user", "moderator", "admin"];
      for (const roleName of roles) {
        const role = new Role({ name: roleName });
        await role.save();  // Await save
        console.log(`Added '${roleName}' to roles collection`);
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
    message: "Welcome to JWT Authentication API",
    documentation: `http://localhost:${PORT}`,
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        signin: "POST /api/auth/signin",
        refreshtoken: "POST /api/auth/refreshtoken",
        signout: "POST /api/auth/signout",
      },
      test: {
        public: "GET /api/test/all",
        user: "GET /api/test/user",
        moderator: "GET /api/test/mod",
        admin: "GET /api/test/admin",
      },
      user: {
        profile: "GET /api/user/profile",
      },
    },
  });
});

// Load Routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);

// ====================
// 404 Handler
// ====================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ====================
// Start Server
// ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});