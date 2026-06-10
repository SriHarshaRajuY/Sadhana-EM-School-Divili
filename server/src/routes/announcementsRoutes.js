const express = require("express");
const {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  listAnnouncements,
  updateAnnouncement
} = require("../controllers/announcementsController");
const requireAdmin = require("../middleware/adminAuth");
const { validateBody, validateParams } = require("../middleware/validate");
const {
  announcementCreateSchema,
  announcementUpdateSchema,
  objectIdSchema
} = require("../validators/contentSchemas");

const router = express.Router();

router
  .route("/")
  .get(listAnnouncements)
  .post(requireAdmin, validateBody(announcementCreateSchema), createAnnouncement);

router
  .route("/:id")
  .get(validateParams(objectIdSchema), getAnnouncement)
  .patch(requireAdmin, validateParams(objectIdSchema), validateBody(announcementUpdateSchema), updateAnnouncement)
  .delete(requireAdmin, validateParams(objectIdSchema), deleteAnnouncement);

module.exports = router;
