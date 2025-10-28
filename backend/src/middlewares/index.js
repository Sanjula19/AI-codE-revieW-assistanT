// src/middlewares/index.js
const verifySignUp = require("./verifySignUp");
const authJwt = require("./authJwt");

module.exports = {
  verifySignUp,
  authJwt,
};