const express = require("express");
const { listAllAnnouncements } = require("../controllers/announcementsController");
const { listAllEvents } = require("../controllers/eventsController");
const { listAllFaculty } = require("../controllers/facultyController");
const { listInquiries } = require("../controllers/inquiriesController");
const { listAllPrograms } = require("../controllers/programsController");
const requireAdmin = require("../middleware/adminAuth");

const router = express.Router();

router.use(requireAdmin);

router.get("/announcements", listAllAnnouncements);
router.get("/events", listAllEvents);
router.get("/faculty", listAllFaculty);
router.get("/programs", listAllPrograms);
router.get("/inquiries", listInquiries);

module.exports = router;
