const env = require("../config/env");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createAdminToken,
  verifyPassword,
  verifyPlainPassword
} = require("../services/authService");

const login = asyncHandler(async (req, res) => {
  if (!env.ADMIN_USERNAME || (!env.ADMIN_PASSWORD_HASH && !env.ADMIN_PASSWORD) || !env.ADMIN_TOKEN_SECRET) {
    const error = new Error("Admin authentication is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const usernameMatches = req.body.username === env.ADMIN_USERNAME;
  const passwordMatches = env.ADMIN_PASSWORD_HASH
    ? verifyPassword(req.body.password, env.ADMIN_PASSWORD_HASH)
    : verifyPlainPassword(req.body.password, env.ADMIN_PASSWORD);

  if (!usernameMatches || !passwordMatches) {
    const error = new Error("Invalid username or password.");
    error.statusCode = 401;
    throw error;
  }

  res.json({
    data: {
      token: createAdminToken(),
      tokenType: "Bearer",
      expiresInMinutes: env.ADMIN_TOKEN_EXPIRES_IN_MINUTES,
      user: {
        username: env.ADMIN_USERNAME,
        role: "admin"
      }
    }
  });
});

module.exports = {
  login
};
