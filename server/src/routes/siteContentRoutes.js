const express = require("express");
const {
  getSiteContent,
  updateSiteContent
} = require("../controllers/siteContentController");
const requireAdmin = require("../middleware/adminAuth");
const { validateBody } = require("../middleware/validate");
const { siteContentSchema } = require("../validators/contentSchemas");

const router = express.Router();

router
  .route("/")
  .get(getSiteContent)
  .put(requireAdmin, validateBody(siteContentSchema), updateSiteContent);

module.exports = router;
