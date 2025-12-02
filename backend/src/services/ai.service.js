// src/services/ai.service.js
const axios = require('axios');
const logger = require('../utils/logger');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://python-ai-service:8000/analyze";

const sendToAI = async (code, language) => {
  try {
    const response = await axios.post(AI_SERVICE_URL, { code, language }, {
      timeout: 15000, // 15s timeout
    });
    return { success: true, data: response.data };
  } catch (error) {
    logger.error(`AI Service Error: ${error.message}`);
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: "AI service timeout" };
    }
    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = { sendToAI };