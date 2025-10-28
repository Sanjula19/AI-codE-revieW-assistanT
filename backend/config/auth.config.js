module.exports = {
  secret: process.env.JWT_SECRET || "fallback-jwt-secret-key-change-in-prod",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret-change-in-prod",
  jwtExpiration: 3600, // 1 hour
  jwtRefreshExpiration: 86400, // 24 hours
};''

