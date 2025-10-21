const express = require('express');
const router = express.Router();
const { signup, login, logout, refreshToken, oauthLogin, getMe, forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.post('/oauth/:provider', oauthLogin);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email', verifyEmail);

module.exports = router;