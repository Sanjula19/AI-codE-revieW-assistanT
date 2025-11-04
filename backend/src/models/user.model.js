const mongoose = require('mongoose');

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: false,  // Not required for Google users
      minlength: 6
    },
    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true  // Allows nulls without unique conflict
    },
   
firstName: { type: String, trim: true },
lastName:  { type: String, trim: true },


    picture: String,  // Google profile pic URL
    // Existing fields
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    refreshToken: { type: String, default: null }
  }, {
    timestamps: true
  })
);

module.exports = User;