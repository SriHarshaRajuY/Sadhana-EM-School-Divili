const Program = require("../models/Program");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createContent,
  deleteContent,
  getContentById,
  listContent,
  updateContent
} = require("../services/contentService");

const listPrograms = asyncHandler(async (req, res) => {
  const data = await listContent({
    model: Program,
    filter: { isPublished: true },
    sort: { order: 1, title: 1 }
  });

  res.json({ data });
});

const getProgram = asyncHandler(async (req, res) => {
  const data = await getContentById({
    model: Program,
    id: req.params.id,
    resourceName: "Program"
  });

  res.json({ data });
});

const createProgram = asyncHandler(async (req, res) => {
  const data = await createContent({ model: Program, data: req.body });
  res.status(201).json({ data });
});

const updateProgram = asyncHandler(async (req, res) => {
  const data = await updateContent({
    model: Program,
    id: req.params.id,
    data: req.body,
    resourceName: "Program"
  });

  res.json({ data });
});

const deleteProgram = asyncHandler(async (req, res) => {
  await deleteContent({
    model: Program,
    id: req.params.id,
    resourceName: "Program"
  });

  res.status(204).send();
});

module.exports = {
  createProgram,
  deleteProgram,
  getProgram,
  listPrograms,
  updateProgram
};
