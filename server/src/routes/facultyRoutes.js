const express = require("express");
const {
  createFacultyMember,
  deleteFacultyMember,
  getFacultyMember,
  listFaculty,
  updateFacultyMember
} = require("../controllers/facultyController");
const requireAdmin = require("../middleware/adminAuth");
const { validateBody, validateParams } = require("../middleware/validate");
const { facultyCreateSchema, facultyUpdateSchema, objectIdSchema } = require("../validators/contentSchemas");

const router = express.Router();

router.route("/").get(listFaculty).post(requireAdmin, validateBody(facultyCreateSchema), createFacultyMember);

router
  .route("/:id")
  .get(validateParams(objectIdSchema), getFacultyMember)
  .patch(requireAdmin, validateParams(objectIdSchema), validateBody(facultyUpdateSchema), updateFacultyMember)
  .delete(requireAdmin, validateParams(objectIdSchema), deleteFacultyMember);

module.exports = router;
