// src/config/passport.config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../src/models');

const User = db.user;
const Role = db.role;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // ✅ full URL from .env
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user based on Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create new user with default "user" role
          const defaultRole = await Role.findOne({ name: 'user' });
          if (!defaultRole)
            return done(new Error('Default role "user" not found'));

          user = new User({
            googleId: profile.id,
            username: profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            picture: profile.photos[0].value,
            roles: [defaultRole._id],
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user to session (store user ID)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user (fetch user by ID)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('roles');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
