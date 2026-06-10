const multer = require("multer");
const env = require("../config/env");

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.CLOUDINARY_UPLOAD_MAX_BYTES,
    files: 1
  },
  fileFilter(req, file, callback) {
    if (!allowedImageTypes.has(file.mimetype)) {
      return callback(new Error("Only JPG, PNG, WEBP, and GIF images are allowed."));
    }

    return callback(null, true);
  }
});

const handleUploadErrors = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  err.statusCode = err.statusCode || (err.code === "LIMIT_FILE_SIZE" ? 413 : 400);
  return next(err);
};

module.exports = {
  handleUploadErrors,
  imageUpload
};
