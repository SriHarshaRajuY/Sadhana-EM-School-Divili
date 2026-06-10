const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  createInquiry,
  listInquiries,
  updateInquiryStatus
} = require("../controllers/inquiriesController");
const env = require("../config/env");
const requireAdmin = require("../middleware/adminAuth");
const { validateBody, validateParams } = require("../middleware/validate");
const { inquiryCreateSchema, inquiryStatusSchema, recordIdSchema } = require("../validators/contentSchemas");

const router = express.Router();
const inquiryLimiter = rateLimit({
  windowMs: env.INQUIRY_RATE_LIMIT_WINDOW_MS,
  max: env.INQUIRY_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many enquiries were submitted from this connection. Please try again later."
    }
  }
});

router
  .route("/")
  .get(requireAdmin, listInquiries)
  .post(inquiryLimiter, validateBody(inquiryCreateSchema), createInquiry);

router.patch(
  "/:id/status",
  requireAdmin,
  validateParams(recordIdSchema),
  validateBody(inquiryStatusSchema),
  updateInquiryStatus
);

module.exports = router;
