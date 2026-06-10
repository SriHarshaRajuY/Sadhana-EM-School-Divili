const { v2: cloudinary } = require("cloudinary");
const env = require("./env");

const isCloudinaryConfigured = () =>
  Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

const requireCloudinary = () => {
  if (!isCloudinaryConfigured()) {
    const error = new Error("Cloudinary image uploads are not configured.");
    error.statusCode = 503;
    throw error;
  }

  return cloudinary;
};

module.exports = {
  isCloudinaryConfigured,
  requireCloudinary
};
