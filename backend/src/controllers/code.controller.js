// src/controllers/code.controller.js
const db = require("../models");
const CodeReview = db.codeReview;

const uploadCode = async (req, res) => {
  try {
    const { codeText, language = 'plaintext' } = req.body;
    if (!codeText || codeText.trim().length === 0) {
      return res.status(400).send({ message: "Code cannot be empty!" });
    }

    const review = new CodeReview({
      userId: req.userId,
      codeText: codeText.trim(),
      language
    });

    await review.save();
    res.status(201).send({
      message: "Code uploaded successfully!",
      reviewId: review._id,
      status: review.status
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { uploadCode };