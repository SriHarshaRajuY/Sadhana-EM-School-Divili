const Announcement = require("../models/Announcement");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createContent,
  deleteContent,
  getContentById,
  listContent,
  updateContent
} = require("../services/contentService");

const publicAnnouncementFilter = () => ({
  isPublished: true,
  $or: [{ expiresAt: null }, { expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }]
});

const announcementSort = { priority: -1, publishedAt: -1, createdAt: -1 };

const listAnnouncements = asyncHandler(async (req, res) => {
  const result = await listContent({
    model: Announcement,
    filter: publicAnnouncementFilter(),
    sort: announcementSort,
    page: req.query.page,
    limit: req.query.limit
  });

  res.json(result);
});

const listAllAnnouncements = asyncHandler(async (req, res) => {
  const result = await listContent({
    model: Announcement,
    sort: announcementSort,
    page: req.query.page,
    limit: req.query.limit
  });

  res.json(result);
});

const getAnnouncement = asyncHandler(async (req, res) => {
  const data = await getContentById({
    model: Announcement,
    id: req.params.id,
    resourceName: "Announcement",
    filter: publicAnnouncementFilter()
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
  listAllAnnouncements,
  listAnnouncements,
  updateAnnouncement
};
