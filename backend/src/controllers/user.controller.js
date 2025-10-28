const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getUserProfile = (req, res) => {
  User.findById(req.userId)
    .select("-password")
    .populate("roles")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      const authorities = user.roles.map(
        role => "ROLE_" + role.name.toUpperCase()
      );

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    });
};