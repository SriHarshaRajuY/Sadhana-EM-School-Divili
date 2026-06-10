const path = require("path");
const env = require("../config/env");
const { requireCloudinary } = require("../config/cloudinary");
const asyncHandler = require("../middleware/asyncHandler");

const allowedContexts = new Set([
  "announcements",
  "events",
  "faculty",
  "gallery",
  "hero",
  "site-content"
]);

const sanitizeFolderPart = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const uploadBuffer = (file, options) =>
  new Promise((resolve, reject) => {
    const stream = requireCloudinary().uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    stream.end(file.buffer);
  });

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Image file is required.");
    error.statusCode = 400;
    throw error;
  }

  const context = allowedContexts.has(req.body.context) ? req.body.context : "site-content";
  const folder = [env.CLOUDINARY_FOLDER, sanitizeFolderPart(context)].filter(Boolean).join("/");
  const originalName = path.parse(req.file.originalname || "school-image").name;

  const result = await uploadBuffer(req.file, {
    folder,
    public_id: sanitizeFolderPart(originalName) || undefined,
    resource_type: "image",
    overwrite: false,
    use_filename: true,
    unique_filename: true,
    transformation: [
      {
        quality: "auto:good",
        fetch_format: "auto"
      }
    ],
    context: {
      source: "sadhana-school-admin",
      uploadContext: context
    }
  });

  res.status(201).json({
    data: {
      url: result.secure_url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      context
    }
  });
});

const deleteImage = asyncHandler(async (req, res) => {
  const publicId = String(req.body.publicId || "").trim();

  if (!publicId) {
    const error = new Error("Cloudinary publicId is required.");
    error.statusCode = 400;
    throw error;
  }

  const result = await requireCloudinary().uploader.destroy(publicId, {
    resource_type: "image"
  });

  res.json({
    data: {
      publicId,
      result: result.result
    }
  });
});

module.exports = {
  deleteImage,
  uploadImage
};
