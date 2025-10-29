const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "x-access-token, Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Signup
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  // Signin
  app.post("/api/auth/signin", controller.signin);

  // Refresh token
  app.post("/api/auth/refreshtoken", controller.refreshToken);

  // Signout (protected)
  app.post("/api/auth/signout", [authJwt.verifyToken], controller.signout);
};
