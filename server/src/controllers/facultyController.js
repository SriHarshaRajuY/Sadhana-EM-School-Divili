const Faculty = require("../models/Faculty");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createContent,
  deleteContent,
  getContentById,
  listContent,
  updateContent
} = require("../services/contentService");

const publicFacultyFilter = { isActive: true };
const facultySort = { order: 1, name: 1 };

const listFaculty = asyncHandler(async (req, res) => {
  const result = await listContent({
    model: Faculty,
    filter: publicFacultyFilter,
    sort: facultySort,
    page: req.query.page,
    limit: req.query.limit
  });

  res.json(result);
});

const listAllFaculty = asyncHandler(async (req, res) => {
  const result = await listContent({
    model: Faculty,
    sort: facultySort,
    page: req.query.page,
    limit: req.query.limit
  });

  res.json(result);
});

const getFacultyMember = asyncHandler(async (req, res) => {
  const data = await getContentById({
    model: Faculty,
    id: req.params.id,
    resourceName: "Faculty member",
    filter: publicFacultyFilter
  });

  res.json({ data });
});

const createFacultyMember = asyncHandler(async (req, res) => {
  const data = await createContent({ model: Faculty, data: req.body });
  res.status(201).json({ data });
});

const updateFacultyMember = asyncHandler(async (req, res) => {
  const data = await updateContent({
    model: Faculty,
    id: req.params.id,
    data: req.body,
    resourceName: "Faculty member"
  });

  res.json({ data });
});

const deleteFacultyMember = asyncHandler(async (req, res) => {
  await deleteContent({
    model: Faculty,
    id: req.params.id,
    resourceName: "Faculty member"
  });

  res.status(204).send();
});

module.exports = {
  createFacultyMember,
  deleteFacultyMember,
  getFacultyMember,
  listAllFaculty,
  listFaculty,
  updateFacultyMember
};
