// src/services/user.service.js
const User = require('../models/user.model');

const getProfile = async (userId) => {
  return await User.findById(userId)
    .select("-password -refreshToken -googleId")
    .populate("roles", "name");
};

const updateProfile = async (userId, updates) => {
  const allowed = ["firstName", "lastName", "picture", "bio", "languagePreference"];
  const filtered = {};
  allowed.forEach(field => {
    if (updates[field] !== undefined) filtered[field] = updates[field];
  });
  return await User.findByIdAndUpdate(userId, filtered, { new: true })
    .select("-password -refreshToken");
};

const upgradeToPro = async (userId) => {
  const expiresOn = new Date();
  expiresOn.setFullYear(expiresOn.getFullYear() + 1);

  return await User.findByIdAndUpdate(userId, {
    planType: "pro",
    planExpiresOn: expiresOn
  }, { new: true }).select("-password -refreshToken");
};

module.exports = { getProfile, updateProfile, upgradeToPro };