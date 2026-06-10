const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env"), override: true });

const parseList = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseNumber(process.env.PORT, 5000),
  MONGODB_URI: process.env.MONGODB_URI || "",
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || "",
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || "",
  ADMIN_TOKEN_SECRET: process.env.ADMIN_TOKEN_SECRET || "",
  ADMIN_TOKEN_EXPIRES_IN_MINUTES: parseNumber(process.env.ADMIN_TOKEN_EXPIRES_IN_MINUTES, 60),
  CORS_ORIGINS: parseList(process.env.CORS_ORIGIN, [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]),
  RATE_LIMIT_WINDOW_MS: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  RATE_LIMIT_MAX: parseNumber(process.env.RATE_LIMIT_MAX, 200),
  INQUIRY_RATE_LIMIT_WINDOW_MS: parseNumber(process.env.INQUIRY_RATE_LIMIT_WINDOW_MS, 60 * 60 * 1000),
  INQUIRY_RATE_LIMIT_MAX: parseNumber(process.env.INQUIRY_RATE_LIMIT_MAX, 20),
  TRUST_PROXY: process.env.TRUST_PROXY === "true"
};

if (env.NODE_ENV === "production" && !env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required in production.");
}

if (env.NODE_ENV === "production" && !env.ADMIN_USERNAME) {
  throw new Error("ADMIN_USERNAME is required in production.");
}

if (env.NODE_ENV === "production" && !env.ADMIN_PASSWORD_HASH) {
  throw new Error("ADMIN_PASSWORD_HASH is required in production.");
}

if (env.NODE_ENV === "production" && !env.ADMIN_TOKEN_SECRET) {
  throw new Error("ADMIN_TOKEN_SECRET is required in production.");
}

module.exports = env;
