const passport = require('../../config/passport.config'); 
const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');
const db = require("../models");
const User = db.user;

module.exports = function(app) {
  
  // 1. Start Google Login
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // 2. Google Callback
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { session: false }), 
    async (req, res) => {
      try {
        let user = req.user;
        
        // Safety Check: Did Passport fail to find a user?
        if (!user) {
          console.error("Passport returned no user.");
          return res.redirect('http://localhost:5173/login?error=NoUserFound');
        }

        // Safety Check: Ensure user has a role
        // If the database setup (initial function) hasn't run yet, user.roles might be empty or invalid
        if (!user.roles || user.roles.length === 0 || !user.roles[0].name) {
          // Attempt to fix it on the fly by fetching again
          user = await User.findById(user._id).populate('roles', '-__v');
        }
        
        // If still no roles, something is wrong with the DB initialization
        if (!user.roles || user.roles.length === 0) {
           throw new Error("User has no roles assigned. Database might be missing 'user' role.");
        }

        // Generate Tokens
        const accessToken = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.jwtExpiration
        });

        // ✅ SUCCESS: Redirect to Frontend (Port 5173) with Token
        res.redirect(`http://localhost:5173/login?token=${accessToken}`);

      } catch (err) {
        console.error('CRITICAL GOOGLE AUTH ERROR:', err); 
        // Redirect back to login page with the specific error message
        res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(err.message)}`);
      }
    }
  );

  // 3. Logout (Optional)
  app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send(err);
      req.session = null;
    });
    res.redirect('/');
  });
};