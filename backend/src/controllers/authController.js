const authService = require('../services/authService');
const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const signup = async (req, res, next) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    await authService.createUser(req.body.name, req.body.email, req.body.password);
    res.status(201).json({ message: 'Signup successful. Check email for verification.', success: true });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { accessToken, refreshToken } = await authService.authenticate(req.body.email, req.body.password);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.revokeRefreshToken(req.user._id, req.token);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { error } = refreshSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { accessToken, refreshToken } = await authService.refreshTokens(req.body.refreshToken);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const oauthLogin = async (req, res, next) => {
  try {
    const { code, provider } = req.body;
    const { accessToken, refreshToken } = await authService.handleOAuth({ id: code, emails: [{ value: req.user.email }], displayName: req.user.name }, provider);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    await authService.initiatePasswordReset(req.body.email);
    res.json({ message: 'Reset email sent' });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate({ ...req.body, token: req.params.token });
    if (error) return res.status(400).json({ message: error.details[0].message });
    await authService.completePasswordReset(req.params.token, req.body.newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const token = await authService.verifyEmailToken(req.query.token);
    res.json({ message: 'Email verified successfully', token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  oauthLogin,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail
};