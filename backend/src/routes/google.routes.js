const passport = require('../../config/passport.config');  // Corrected path
const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');
const { authJwt } = require('../middlewares');

module.exports = function (app) {
  // Google OAuth login
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Google OAuth callback
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
      // On success: Generate JWT tokens
      const user = req.user;
      const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

      const accessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
        expiresIn: config.jwtRefreshExpiration
      });

      // Redirect to frontend with tokens
      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken,
        refreshToken
      };

      const queryString = new URLSearchParams(tokenData).toString();
      res.redirect(`http://localhost:3000/auth/success?${queryString}`);
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