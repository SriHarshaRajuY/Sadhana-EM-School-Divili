const Event = require("../models/Event");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createContent,
  deleteContent,
  getContentById,
  listContent,
  updateContent
} = require("../services/contentService");

const listEvents = asyncHandler(async (req, res) => {
  const data = await listContent({
    model: Event,
    filter: { isPublished: true },
    sort: { startsAt: 1, createdAt: -1 }
  });

  res.json({ data });
});

const getEvent = asyncHandler(async (req, res) => {
  const data = await getContentById({
    model: Event,
    id: req.params.id,
    resourceName: "Event"
  });

  res.json({ data });
});

const createEvent = asyncHandler(async (req, res) => {
  const data = await createContent({ model: Event, data: req.body });
  res.status(201).json({ data });
});

const updateEvent = asyncHandler(async (req, res) => {
  const data = await updateContent({
    model: Event,
    id: req.params.id,
    data: req.body,
    resourceName: "Event"
  });

  res.json({ data });
});

const deleteEvent = asyncHandler(async (req, res) => {
  await deleteContent({
    model: Event,
    id: req.params.id,
    resourceName: "Event"
  });

  res.status(204).send();
});

module.exports = {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent
};
