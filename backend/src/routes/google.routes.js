const passport = require('../../config/passport.config');  // Corrected path
const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');
const { authJwt } = require('../middlewares');

module.exports = function (app) {
  // Google OAuth login
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false }),  // No session for API
  async (req, res) => {
    try {
      let user = req.user;
      if (!user) throw new Error('No user from Passport');

      // Populate roles if not already (fixes role.name undefined)
      if (!user.roles[0] || !user.roles[0].name) {
        user = await User.findById(user._id).populate('roles', '-__v');
      }

      const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

      const accessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
        expiresIn: config.jwtRefreshExpiration
      });

      // Optional: Store refreshToken in DB
      user.refreshToken = refreshToken;
      await user.save();

      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken,
        refreshToken
      };

      const queryString = new URLSearchParams(tokenData).toString();
     res.redirect(`http://localhost:5173/login?token=${accessToken}`);
    } catch (err) {
      console.error('Google OAuth Callback Error:', err.message, err.stack);  // Add this for full stack trace
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);
  // Logout
  app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send(err);
      req.session.destroy();
    });
    res.redirect('/');
  });
};