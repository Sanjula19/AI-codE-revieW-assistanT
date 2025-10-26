const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              return res.status(500).send({ message: err });
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration // 1 hour
      });

      const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
        expiresIn: config.jwtRefreshExpiration // 24 hours
      });

      const authorities = user.roles.map(
        role => "ROLE_" + role.name.toUpperCase()
      );

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken
      });
    });
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