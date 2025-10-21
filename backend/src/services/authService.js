const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

const createUser = async (name, email, password) => {
  const user = await User.create({ name, email, passwordHash: password });
  const token = generateToken(user._id);
  await sendVerificationEmail(email, token);
  return user;
};

const authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !await user.matchPassword(password) || !user.isEmailVerified) throw new Error('Invalid credentials');
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push({ token: crypto.createHash('sha256').update(refreshToken).digest('hex'), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), deviceInfo: 'Unknown' });
  user.lastLoginAt = new Date();
  await user.save();
  return { accessToken, refreshToken };
};

const handleOAuth = async (profile, provider) => {
  let user = await User.findOne({ 'oauthProviders.providerId': profile.id });
  if (!user && profile.emails?.[0]?.value) {
    user = await User.findOne({ email: profile.emails[0].value });
    if (user) user.oauthProviders.push({ provider, providerId: profile.id });
    else user = await User.create({ name: profile.displayName, email: profile.emails[0].value, oauthProviders: [{ provider, providerId: profile.id }], isEmailVerified: true });
  }
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push({ token: crypto.createHash('sha256').update(refreshToken).digest('hex'), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), deviceInfo: 'OAuth Device' });
  await user.save();
  return { accessToken, refreshToken };
};

const refreshTokens = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokens.some(t => crypto.createHash('sha256').update(refreshToken).digest('hex') === t.token && t.expiresAt > Date.now())) throw new Error('Invalid refresh token');
  user.refreshTokens = user.refreshTokens.filter(t => t.token !== crypto.createHash('sha256').update(refreshToken).digest('hex'));
  const newAccessToken = generateToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push({ token: crypto.createHash('sha256').update(newRefreshToken).digest('hex'), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), deviceInfo: 'Refreshed' });
  await user.save();
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const revokeRefreshToken = async (userId, token) => {
  const user = await User.findById(userId);
  user.refreshTokens = user.refreshTokens.filter(t => t.token !== crypto.createHash('sha256').update(token).digest('hex'));
  await user.save();
};

const initiatePasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();
  await sendResetPasswordEmail(email, token);
};

const completePasswordReset = async (token, newPassword) => {
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) throw new Error('Invalid or expired token');
  user.passwordHash = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

const verifyEmailToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('Invalid token');
  user.isEmailVerified = true;
  await user.save();
  return generateToken(user._id);
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash -refreshTokens');
  if (!user) throw new Error('User not found');
  return user;
};

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email',
    html: `<a href="${verifyUrl}">Verify Email</a>`
  });
};

const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset',
    html: `<a href="${resetUrl}">Reset Password</a>`
  });
};

module.exports = {
  createUser,
  authenticate,
  handleOAuth,
  refreshTokens,
  revokeRefreshToken,
  initiatePasswordReset,
  completePasswordReset,
  verifyEmailToken,
  getCurrentUser
};