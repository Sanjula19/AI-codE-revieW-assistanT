// src/controllers/auth.controller.js
const db = require("../models");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/auth.config");

// ──────────────────────────────────────────────────────────────
//  SIGNUP
// ──────────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    await user.save();

    if (req.body.roles && req.body.roles.length) {
      const foundRoles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = foundRoles.map((r) => r._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      if (!defaultRole) throw new Error('Default role "user" not found');
      user.roles = [defaultRole._id];
    }

    await user.save();
    res.send({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ──────────────────────────────────────────────────────────────
//  SIGNIN
// ──────────────────────────────────────────────────────────────
const signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");
    if (!user) return res.status(404).send({ message: "User Not found." });

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    const accessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
      expiresIn: config.jwtRefreshExpiration,
    });

    user.refreshToken = refreshToken;
    await user.save();

    const authorities = user.roles.map((r) => "ROLE_" + r.name.toUpperCase());

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ──────────────────────────────────────────────────────────────
//  REFRESH TOKEN
// ──────────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  const { refreshToken: incoming } = req.body;
  if (!incoming) return res.status(403).send({ message: "Refresh Token required!" });

  try {
    const decoded = jwt.verify(incoming, config.refreshSecret);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incoming) {
      return res.status(403).send({ message: "Invalid Refresh Token!" });
    }

    const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    res.send({ accessToken: newAccessToken, refreshToken: incoming });
  } catch (err) {
    res.status(403).send({ message: "Invalid or expired token!" });
  }
};

// ──────────────────────────────────────────────────────────────
//  SIGNOUT
// ──────────────────────────────────────────────────────────────
const signout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { refreshToken: null });
    res.send({ message: "Logged out successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ──────────────────────────────────────────────────────────────
//  EXPORT ALL
// ──────────────────────────────────────────────────────────────
module.exports = {
  signup,
  signin,
  refreshToken,
  signout,
};