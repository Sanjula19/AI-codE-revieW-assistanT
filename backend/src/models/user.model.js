// src/models/user.model.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true },
    firstName: String,
    lastName: String,
    picture: String,
    bio: { type: String, maxlength: 500 },
    languagePreference: { type: String, default: "javascript" },
    planType: { type: String, enum: ["free", "pro"], default: "free" },
    planExpiresOn: { type: Date },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
