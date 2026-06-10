const express = require("express");
const { isMongoConnected } = require("../config/database");
const announcementsRoutes = require("./announcementsRoutes");
const authRoutes = require("./authRoutes");
const eventsRoutes = require("./eventsRoutes");
const facultyRoutes = require("./facultyRoutes");
const inquiriesRoutes = require("./inquiriesRoutes");
const programsRoutes = require("./programsRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: isMongoConnected() ? "connected" : "offline",
    timestamp: new Date().toISOString()
  });
});

router.use("/announcements", announcementsRoutes);
router.use("/auth", authRoutes);
router.use("/events", eventsRoutes);
router.use("/faculty", facultyRoutes);
router.use("/inquiries", inquiriesRoutes);
router.use("/programs", programsRoutes);

module.exports = router;
