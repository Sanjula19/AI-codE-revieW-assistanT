// src/services/ai.service.js
const axios = require('axios');
const Redis = require('ioredis');
const logger = require('../utils/logger');
const crypto = require('crypto');

// Connect to Redis (with fallback)
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : new Redis(); // defaults to localhost:6379

const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/analyze";

// Generate unique cache key from code + language
const getCacheKey = (code, language = "javascript") => {
  const hash = crypto.createHash('md5').update(code.trim() + language).digest('hex');
  return `ai_analysis:${hash}`;
};

// MAIN FUNCTION — WITH REDIS CACHING (YOUR STEP 5)
const analyzeCodeCached = async (code, language = "javascript") => {
  const cacheKey = getCacheKey(code, language);

  try {
    // 1. Check Redis cache first (0.5ms response!)
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.info("AI result served from Redis cache");
      return { success: true, data: JSON.parse(cached), cached: true };
    }
  } catch (err) {
    logger.warn("Redis unavailable, skipping cache");
  }

  try {
    // 2. Call FastAPI AI Engine
    const response = await axios.post(AI_URL, { code, language }, { timeout: 15000 });

    const result = {
      score: response.data.qualityScore || response.data.score,
      errors: response.data.issues || [],
      suggestions: response.data.recommendations || [],
      securityIssues: response.data.securityIssues || 0,
      bestPractices: response.data.bestPractices || false
    };

    // 3. Cache result for 24 hours
    try {
      await redis.set(cacheKey, JSON.stringify(result), "EX", 86400);
      logger.info("AI result cached in Redis for 24h");
    } catch (err) {
      logger.warn("Failed to cache in Redis");
    }

    return { success: true, data: result, cached: false };

  } catch (error) {
    logger.error(`AI Engine failed: ${error.message}`);
    return { 
      success: false, 
      error: error.response?.data?.detail || "AI service unavailable" 
    };
  }
};

module.exports = { analyzeCodeCached };