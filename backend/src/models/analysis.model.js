const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Changed to false to allow null for unauthenticated users
  },
  code: { type: String, required: true },
  language: { type: String, default: "javascript" },
  qualityScore: { type: Number, min: 0, max: 100 },
  issues: [String],
  recommendations: [String],
  securityIssues: { type: Number, default: 0 },
  bestPractices: { type: Boolean, default: false },
  cached: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Analysis", AnalysisSchema);