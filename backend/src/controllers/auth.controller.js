// src/controllers/auth.controller.js

const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Create new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), // Hash password
    });

    // Save user (no callback!)
    await user.save();

    // Assign roles if provided
    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roles.map(role => role._id);
      await user.save(); // Save again with roles
    } else {
      // Default to "user" role
      const defaultRole = await Role.findOne({ name: "user" });
      user.roles = [defaultRole._id];
      await user.save();
    }

    res.send({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    const authorities = [];
    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).send({ message: "Refresh Token is required!" });
  }

  jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid Refresh Token!" });
    }

    User.findById(decoded.id).exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }

      const newToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      const newRefreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
        expiresIn: config.jwtRefreshExpiration
      });

      res.status(200).send({
        accessToken: newToken,
        refreshToken: newRefreshToken
      });
    });
  });
};

exports.signout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { refreshToken: null });
    res.status(200).send({ message: "Logged out successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signout = (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err || !user) {
      return res.status(500).send({ message: err || "User not found" });
    }
    user.refreshToken = null;
    user.save((err) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      res.status(200).send({ message: "Logged out successfully!" });
    });
  });
};