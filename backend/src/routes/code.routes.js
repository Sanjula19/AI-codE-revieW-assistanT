// src/routes/code.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/code.controller");

// Route: POST /api/code/upload
router.post("/upload", controller.uploadCode);

module.exports = router;