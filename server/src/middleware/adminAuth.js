const { verifyAdminToken } = require("../services/authService");

const getBearerToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return "";
};

const requireAdmin = (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) {
    const error = new Error("Please sign in to continue.");
    error.statusCode = 401;
    return next(error);
  }

  try {
    req.admin = verifyAdminToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = requireAdmin;
