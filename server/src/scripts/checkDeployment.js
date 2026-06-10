process.env.NODE_ENV = "production";

try {
  const env = require("../config/env");

  const warnings = [];
  if (env.CORS_ORIGINS.some((origin) => origin.includes("localhost") || origin.includes("127.0.0.1"))) {
    warnings.push("CORS_ORIGIN still includes localhost. Replace it with the deployed frontend domain before launch.");
  }

  console.log("Deployment environment check passed.");
  console.log(
    JSON.stringify(
      {
        mongoConfigured: Boolean(env.MONGODB_URI),
        adminConfigured: Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD_HASH && env.ADMIN_TOKEN_SECRET),
        cloudinaryConfigured: Boolean(
          env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
        ),
        cloudinaryFolder: env.CLOUDINARY_FOLDER,
        uploadMaxBytes: env.CLOUDINARY_UPLOAD_MAX_BYTES,
        warnings
      },
      null,
      2
    )
  );

  process.exit(warnings.length ? 2 : 0);
} catch (error) {
  console.error(`Deployment environment check failed: ${error.message}`);
  process.exit(1);
}
