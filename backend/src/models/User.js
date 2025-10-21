const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false },
  avatar: { type: String, default: null },
  oauthProviders: [{ provider: String, providerId: String }],
  roles: [{ type: String, default: ['user'] }],
  planType: { type: String, default: 'free' },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: null },
  refreshTokens: [{ token: String, expiresAt: Date, deviceInfo: String }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);