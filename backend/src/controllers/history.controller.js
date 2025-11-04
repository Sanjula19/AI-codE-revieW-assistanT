// src/controllers/history.controller.js
const db = require("../models");
const CodeReview = db.codeReview;

const getHistory = async (req, res) => {
  try {
    const reviews = await CodeReview.find({ userId: req.userId })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).send(reviews);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { getHistory };