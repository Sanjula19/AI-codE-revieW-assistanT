const axios = require('axios');
const db = require("../models");
const CodeReview = db.codeReview; // We need this model now

exports.uploadCode = async (req, res) => {
  try {
    const { codeText, language } = req.body;
    // We get the userId from the middleware (req.userId)
    // NOTE: Ensure you are logged in, or we might need to skip this for testing.
    const userId = req.userId || null; 

    console.log(`📡 Sending ${language} code to Python AI Engine...`);

    // 1. Send to Python AI
    let aiResult;
    try {
        const response = await axios.post('http://127.0.0.1:8080/analyze', {
            code: codeText,
            language: language
        });
        aiResult = response.data;
    } catch (err) {
        console.error("AI Connection Error:", err.message);
        return res.status(503).json({ message: "AI Service Unavailable" });
    }

    // 2. Save to Database (The New Part)
    // We only save if we have a valid result
    if (aiResult) {
        const newReview = new CodeReview({
            userId: userId, // Can be null if guest
            codeText: codeText,
            language: language,
            aiResponse: aiResult, // We save the whole JSON object
            status: "completed"
        });

        await newReview.save();
        console.log(`💾 Saved Review ID: ${newReview._id} to MongoDB`);

        // 3. Send back to Frontend
        res.status(200).json({
            reviewId: newReview._id,
            status: "completed",
            aiResponse: aiResult
        });
    }

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Server error processing code" });
  }
};

// Add this to the existing exports
exports.getHistory = async (req, res) => {
  try {
    // For now, we fetch ALL reviews (later we filter by req.userId)
    // .sort({ createdAt: -1 }) means "Newest First"
    const history = await CodeReview.find().sort({ createdAt: -1 }).limit(20);
    
    res.status(200).json(history);
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};