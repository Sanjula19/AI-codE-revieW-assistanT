const CodeReview = require('../models/codeReview.model');
const { sendToAI } = require('./ai.service');
const logger = require('../utils/logger');

const uploadCode = async (userId, { code, language, filename }) => {
  const review = new CodeReview({
    userId,
    code,
    language: language.toLowerCase(),
    filename: filename || "untitled",
  });
  await review.save();

  const aiResult = await sendToAI(code, language);

  if (aiResult.success) {
    review.status = "completed";
    review.aiResponse = {
      qualityScore: aiResult.data.qualityScore || 0,
      suggestions: aiResult.data.suggestions || [],
      errors: aiResult.data.errors || [],
      securityIssues: aiResult.data.securityIssues || 0,
      bestPractices: aiResult.data.bestPractices || false
    };
    review.suggestionCount = (aiResult.data.suggestions?.length || 0) + (aiResult.data.errors?.length || 0);
  } else {
    review.status = "failed";
    logger.error(`AI failed for review ${review._id}: ${aiResult.error}`);
  }

  await review.save();
  return review;
};

module.exports = { uploadCode };