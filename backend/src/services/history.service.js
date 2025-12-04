const CodeReview = require('../models/codeReview.model');

const getHistory = async (userId) => {
  return await CodeReview.find({ userId })
    .select("filename code language createdAt status aiResponse.qualityScore suggestionCount")
    .sort({ createdAt: -1 })
    .limit(50);
};

module.exports = { getHistory };