const express = require("express");
const env = require("../config/env");
const { isMongoConnected } = require("../config/database");
const adminRoutes = require("./adminRoutes");
const announcementsRoutes = require("./announcementsRoutes");
const authRoutes = require("./authRoutes");
const eventsRoutes = require("./eventsRoutes");
const facultyRoutes = require("./facultyRoutes");
const inquiriesRoutes = require("./inquiriesRoutes");
const programsRoutes = require("./programsRoutes");
const siteContentRoutes = require("./siteContentRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  const payload = {
    status: "ok",
    timestamp: new Date().toISOString()
  };

  if (env.NODE_ENV !== "production") {
    payload.database = isMongoConnected() ? "connected" : "offline";
  }

  res.json(payload);
});

router.use("/admin", adminRoutes);
router.use("/announcements", announcementsRoutes);
router.use("/auth", authRoutes);
router.use("/events", eventsRoutes);
router.use("/faculty", facultyRoutes);
router.use("/inquiries", inquiriesRoutes);
router.use("/programs", programsRoutes);
router.use("/site-content", siteContentRoutes);

module.exports = router;
