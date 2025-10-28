const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "x-access-token, Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/refreshtoken", controller.refreshToken);

  // ADD SIGNOUT HERE
  app.post(
    "/api/auth/signout",
    [require("../middlewares").authJwt.verifyToken], // Use full path if needed
    controller.signout
  );
};