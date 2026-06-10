const Inquiry = require("../models/Inquiry");
const { isMongoConnected } = require("../config/database");
const asyncHandler = require("../middleware/asyncHandler");
const { databaseUnavailable, listContent } = require("../services/contentService");

const inquiryStatuses = new Set(["new", "contacted", "visit_scheduled", "admitted", "closed"]);

const createInquiry = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const inquiry = {
    ...req.body,
    source: req.body.source || "website",
    metadata: {
      ip: req.ip,
      userAgent: req.get("user-agent")
    }
  };

  const data = await Inquiry.create(inquiry).catch((error) => {
    if (error.name === "MongooseError" || error.name === "MongoServerSelectionError") {
      throw databaseUnavailable();
    }

    throw error;
  });

  return res.status(201).json({ data });
});

const listInquiries = asyncHandler(async (req, res) => {
  const filter = {};
  if (inquiryStatuses.has(req.query.status)) {
    filter.status = req.query.status;
  }

  const result = await listContent({
    model: Inquiry,
    filter,
    sort: { createdAt: -1 },
    page: req.query.page,
    limit: req.query.limit
  });

  return res.json(result);
});

const deleteInquiry = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const data = await Inquiry.findByIdAndDelete(req.params.id);

  if (!data) {
    const error = new Error("Inquiry not found.");
    error.statusCode = 404;
    throw error;
  }

  return res.status(204).send();
});

const updateInquiryStatus = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const data = await Inquiry.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      notes: req.body.notes
    },
    { new: true, runValidators: true }
  );

  if (!data) {
    const error = new Error("Inquiry not found.");
    error.statusCode = 404;
    throw error;
  }

  return res.json({ data });
});

module.exports = {
  createInquiry,
  deleteInquiry,
  listInquiries,
  updateInquiryStatus
};
