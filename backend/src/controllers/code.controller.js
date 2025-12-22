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
// ✅ CORRECT: Finds ONLY specific user's history
exports.getHistory = async (req, res) => {
  try {
    // 1. We assume your Auth middleware adds 'req.user'
    const userId = req.user.id; // or req.user._id

    // 2. Filter: { user: userId } (Check if your DB uses 'user' or 'userId')
    const history = await Analysis.find({ user: userId }).sort({ createdAt: -1 });
    
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... existing code ...

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Get Total Scans (Count all documents)
   const totalScans = await Analysis.countDocuments({ user: userId });

    // 2. Calculate Average Score (Only for completed reviews)
    const avgResult = await CodeReview.aggregate([
      { $match: { "aiResponse.qualityScore": { $exists: true } } }, // ✅ Filter out bad data
      { $group: { _id: null, avgScore: { $avg: "$aiResponse.qualityScore" } } }
    ]);
    const averageScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;

    // 3. Count Total Issues (Safely handling missing arrays)
    const issuesResult = await CodeReview.aggregate([
      { $match: { "aiResponse.issues": { $exists: true, $type: "array" } } }, // ✅ Filter out bad data
      { $project: { issueCount: { $size: "$aiResponse.issues" } } },
      { $group: { _id: null, totalIssues: { $sum: "$issueCount" } } }
    ]);
    const totalIssues = issuesResult.length > 0 ? issuesResult[0].totalIssues : 0;

    // 4. Get Recent Activity (Safely)
    const recentActivity = await CodeReview.find({ "aiResponse": { $exists: true } }) // ✅ Only valid reviews
      .sort({ createdAt: -1 })
      .limit(3)
      .select('language createdAt aiResponse.qualityScore');

    res.status(200).json({
      totalScans,
      averageScore,
      totalIssues,
      recentActivity
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to calculate stats" });
  }
};