const express = require("express");
const {
  createProgram,
  deleteProgram,
  getProgram,
  listPrograms,
  updateProgram
} = require("../controllers/programsController");
const requireAdmin = require("../middleware/adminAuth");
const { validateBody, validateParams } = require("../middleware/validate");
const { objectIdSchema, programCreateSchema, programUpdateSchema } = require("../validators/contentSchemas");

const router = express.Router();

router.route("/").get(listPrograms).post(requireAdmin, validateBody(programCreateSchema), createProgram);

router
  .route("/:id")
  .get(validateParams(objectIdSchema), getProgram)
  .patch(requireAdmin, validateParams(objectIdSchema), validateBody(programUpdateSchema), updateProgram)
  .delete(requireAdmin, validateParams(objectIdSchema), deleteProgram);

module.exports = router;
