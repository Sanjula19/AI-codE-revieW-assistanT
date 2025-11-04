// src/models/codeReview.model.js
const mongoose = require('mongoose');

const CodeReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  codeText: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    default: 'plaintext',
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'typescript', 'plaintext']
  },
  analysisResult: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('CodeReview', CodeReviewSchema);