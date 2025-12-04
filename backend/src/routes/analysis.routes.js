const express = require("express");
const router = express.Router();

// Import your model and AI service
const Analysis = require("../models/analysis.model");           
const { sendToAI } = require("../services/ai.service");        

// POST /api/v1/analysis → Analyze code
router.post("/", async (req, res) => {
  try {
    const { code, language = "javascript" } = req.body;

    // Validate input
    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code is required" });
    }

    // Call your AI Engine (with Redis caching built-in)
    const result = await sendToAI(code, language);

    if (!result.success) {
      return res.status(503).json({ 
        error: "AI analysis failed",
        details: result.error 
      });
    }

    // Save to MongoDB
    const saved = await Analysis.create({
      userId: req.userId || null, // optional: track user if logged in
      code,
      language,
      qualityScore: result.data.qualityScore,
      issues: result.data.errors,
      recommendations: result.data.suggestions,
      securityIssues: result.data.securityIssues || 0,
      bestPractices: result.data.bestPractices || false,
      cached: result.cached || false
    });

    // Return clean response
    res.json({
      message: "Analysis completed",
      analysis: {
        id: saved._id,
        score: saved.qualityScore,
        issues: saved.issues,
        recommendations: saved.recommendations,
        securityIssues: saved.securityIssues,
        bestPractices: saved.bestPractices,
        cached: saved.cached,
        createdAt: saved.createdAt
      }
    });

  } catch (err) {
    console.error("Analysis route error:", err.message);
    res.status(500).json({ error: "AI analysis failed", details: err.message });
  }
});

module.exports = router;