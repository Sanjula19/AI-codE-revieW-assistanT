// src/routes/code.routes.js
const { authJwt } = require("../middlewares");
const controller = require("../controllers/code.controller");
const historyCtrl = require("../controllers/history.controller");

module.exports = function(app) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "x-access-token, Content-Type");
    next();
  });

  // Upload code
  app.post(
    "/api/code/upload",
    [authJwt.verifyToken],
    controller.uploadCode
  );

  // Get history
  app.get(
    "/api/code/history",
    [authJwt.verifyToken],
    historyCtrl.getHistory
  );
};