module.exports = {
  secret: process.env.JWT_SECRET || "jwt-secret-key",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret-key",
  jwtExpiration: 3600, // 1 hour in seconds
  jwtRefreshExpiration: 86400, // 24 hours in seconds
};