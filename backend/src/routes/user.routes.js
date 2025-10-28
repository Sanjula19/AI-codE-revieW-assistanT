const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  // Set CORS headers globally for all routes
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "x-access-token, Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // PUBLIC: Anyone can access
  app.get("/api/test/all", controller.allAccess);

  // PROTECTED: Any authenticated user
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // MODERATOR ONLY
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  // ADMIN ONLY
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // USER PROFILE: Authenticated user can view own profile
  app.get(
    "/api/user/profile",
    [authJwt.verifyToken],
    controller.getUserProfile
  );


};