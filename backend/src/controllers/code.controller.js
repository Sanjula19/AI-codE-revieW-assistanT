const axios = require('axios'); // Import Axios
const db = require("../models"); // Keep DB import if you use it later
// const CodeReview = db.codeReview; // Uncomment when you are ready to save to DB

exports.uploadCode = async (req, res) => {
  try {
    // 1. Get data from Frontend
    const { codeText, language } = req.body;

    console.log(`📡 Sending ${language} code to Python AI Engine...`);

    // 2. Send to Python AI (Running on Port 8080)
    // Note: Python expects 'code', but frontend sent 'codeText'. We map it here.
    const aiResponse = await axios.post('http://127.0.0.1:8080/analyze', {
      code: codeText,
      language: language
    });

    const result = aiResponse.data;
    console.log("✅ AI Analysis Complete:", result);

    // 3. Return the REAL result to the Frontend
    res.status(200).json({
      reviewId: "ai-" + Date.now(), // Temporary ID
      status: "completed",
      message: "Analysis successful",
      aiResponse: result // This contains qualityScore, issues, etc.
    });

  } catch (error) {
    console.error("❌ AI Engine Error:", error.message);
    
    // If Python is down, tell the user clearly
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: "AI Engine is offline. Please start the Python server on port 8080." 
      });
    }

    res.status(500).json({ message: "Error communicating with AI Engine" });
  }
};