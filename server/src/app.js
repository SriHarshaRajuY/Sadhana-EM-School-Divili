const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const apiRoutes = require("./routes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

if (env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes("*") || env.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error("Origin is not allowed by CORS.");
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true
};

app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use(
  "/api",
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false
  }),
  apiRoutes
);

const clientDist = path.resolve(__dirname, "../../client/dist");

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
