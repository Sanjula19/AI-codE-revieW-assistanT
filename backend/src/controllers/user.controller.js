// src/controllers/user.controller.js
const db = require("../models");
const User = db.user;

const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")  // Exclude password
      .populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const authorities = user.roles.map(
      role => "ROLE_" + role.name.toUpperCase()
    );

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
  getUserProfile
};