const express = require("express");
const { deleteImage, uploadImage } = require("../controllers/uploadsController");
const requireAdmin = require("../middleware/adminAuth");
const { handleUploadErrors, imageUpload } = require("../middleware/imageUpload");

const router = express.Router();

router.post(
  "/image",
  requireAdmin,
  imageUpload.single("image"),
  handleUploadErrors,
  uploadImage
);

router.delete("/image", requireAdmin, deleteImage);

module.exports = router;
