const crypto = require("crypto");
const env = require("../config/env");

const TOKEN_ALGORITHM = "HS256";
const TOKEN_TYPE = "JWT";
const PASSWORD_KEY_LENGTH = 64;

const authError = (message = "Authentication token is invalid.", statusCode = 401) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const base64url = (value) => Buffer.from(value).toString("base64url");

const fromBase64urlJson = (value) => {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch (error) {
    throw authError();
  }
};

const timingSafeEqualText = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const derivedKey = crypto.scryptSync(password, salt, PASSWORD_KEY_LENGTH);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
};

const verifyPassword = (password, storedHash) => {
  const [scheme, salt, hash] = String(storedHash || "").split("$");

  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const candidateHash = hashPassword(password, salt).split("$")[2];
  return timingSafeEqualText(candidateHash, hash);
};

const signToken = (payload) => {
  if (!env.ADMIN_TOKEN_SECRET) {
    const error = new Error("Admin token signing is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const header = base64url(JSON.stringify({ alg: TOKEN_ALGORITHM, typ: TOKEN_TYPE }));
  const body = base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", env.ADMIN_TOKEN_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
};

const verifyAdminToken = (token) => {
  if (!env.ADMIN_TOKEN_SECRET) {
    const error = new Error("Admin token verification is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const parts = String(token || "").split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw authError();
  }

  const [header, body, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", env.ADMIN_TOKEN_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (!timingSafeEqualText(signature, expectedSignature)) {
    throw authError();
  }

  const parsedHeader = fromBase64urlJson(header);
  const payload = fromBase64urlJson(body);

  if (parsedHeader.alg !== TOKEN_ALGORITHM || parsedHeader.typ !== TOKEN_TYPE) {
    throw authError();
  }

  if (!Number.isInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw authError("Authentication token has expired.");
  }

  if (payload.role !== "admin") {
    throw authError("This action is not authorized.", 403);
  }

  return payload;
};

const createAdminToken = () => {
  const now = Math.floor(Date.now() / 1000);
  const expiresInSeconds = env.ADMIN_TOKEN_EXPIRES_IN_MINUTES * 60;

  return signToken({
    sub: env.ADMIN_USERNAME,
    role: "admin",
    iat: now,
    exp: now + expiresInSeconds
  });
};

module.exports = {
  createAdminToken,
  hashPassword,
  verifyAdminToken,
  verifyPassword
};
