const Announcement = require("../models/Announcement");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createContent,
  deleteContent,
  getContentById,
  listContent,
  updateContent
} = require("../services/contentService");

const listAnnouncements = asyncHandler(async (req, res) => {
  const data = await listContent({
    model: Announcement,
    filter: {
      isPublished: true,
      $or: [{ expiresAt: null }, { expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }]
    },
    sort: { priority: -1, publishedAt: -1, createdAt: -1 }
  });

  res.json({ data });
});

const getAnnouncement = asyncHandler(async (req, res) => {
  const data = await getContentById({
    model: Announcement,
    id: req.params.id,
    resourceName: "Announcement"
  });

  res.json({ data });
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const data = await createContent({ model: Announcement, data: req.body });
  res.status(201).json({ data });
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const data = await updateContent({
    model: Announcement,
    id: req.params.id,
    data: req.body,
    resourceName: "Announcement"
  });

  res.json({ data });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  await deleteContent({
    model: Announcement,
    id: req.params.id,
    resourceName: "Announcement"
  });

  res.status(204).send();
});

module.exports = {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  listAnnouncements,
  updateAnnouncement
};
