const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Public access
  app.get("/api/test/all", controller.allAccess);

  // Authenticated users only
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // Moderator access
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  // Admin access
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // Get user profile
  app.get(
    "/api/user/profile",
    [authJwt.verifyToken],
    controller.getUserProfile
  );
};