const express = require("express");
const {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent
} = require("../controllers/eventsController");
const requireAdmin = require("../middleware/adminAuth");
const { validateBody, validateParams } = require("../middleware/validate");
const { eventCreateSchema, eventUpdateSchema, objectIdSchema } = require("../validators/contentSchemas");

const router = express.Router();

router.route("/").get(listEvents).post(requireAdmin, validateBody(eventCreateSchema), createEvent);

router
  .route("/:id")
  .get(validateParams(objectIdSchema), getEvent)
  .patch(requireAdmin, validateParams(objectIdSchema), validateBody(eventUpdateSchema), updateEvent)
  .delete(requireAdmin, validateParams(objectIdSchema), deleteEvent);

module.exports = router;
