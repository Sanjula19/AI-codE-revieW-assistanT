const mongoose = require('mongoose');

const CodeReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: { // Renamed from codeText to match service
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    default: 'plaintext',
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'typescript', 'plaintext']
  },
  filename: { // Added to match service
    type: String,
    default: 'untitled'
  },
  aiResponse: { // Changed from analysisResult (String) to object to match service
    qualityScore: { type: Number, default: 0 },
    suggestions: [String],
    errors: [String],
    securityIssues: { type: Number, default: 0 },
    bestPractices: { type: Boolean, default: false }
  },
  suggestionCount: { // Added to match service
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('CodeReview', CodeReviewSchema);