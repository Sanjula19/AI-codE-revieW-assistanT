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

const updateProfile = async (req, res) => {
  try {
    const allowed = ['firstName', 'lastName', 'username', 'email'];
    const updates = {};

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).send({ message: "No fields to update!" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.send({ message: "Profile updated!", user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
  getUserProfile,
  updateProfile
};