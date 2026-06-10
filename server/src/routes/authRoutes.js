const express = require("express");
const rateLimit = require("express-rate-limit");
const { login } = require("../controllers/authController");
const env = require("../config/env");
const { validateBody } = require("../middleware/validate");
const { authLoginSchema } = require("../validators/contentSchemas");

const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many login attempts. Please wait before trying again."
    }
  }
});

router.post("/login", loginLimiter, validateBody(authLoginSchema), login);

module.exports = router;
