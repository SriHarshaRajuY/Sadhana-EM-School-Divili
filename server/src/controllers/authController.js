const env = require("../config/env");
const asyncHandler = require("../middleware/asyncHandler");
const { createAdminToken, verifyPassword } = require("../services/authService");

const login = asyncHandler(async (req, res) => {
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD_HASH || !env.ADMIN_TOKEN_SECRET) {
    const error = new Error("Admin authentication is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const usernameMatches = req.body.username === env.ADMIN_USERNAME;
  const passwordMatches = verifyPassword(req.body.password, env.ADMIN_PASSWORD_HASH);

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

