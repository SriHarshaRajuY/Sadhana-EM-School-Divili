const crypto = require("crypto");
const Inquiry = require("../models/Inquiry");
const { isMongoConnected } = require("../config/database");
const asyncHandler = require("../middleware/asyncHandler");

const memoryInquiries = [];

const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = {
    ...req.body,
    source: req.body.source || "website",
    metadata: {
      ip: req.ip,
      userAgent: req.get("user-agent")
    }
  };

  if (!isMongoConnected()) {
    const data = {
      _id: crypto.randomUUID(),
      ...inquiry,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryInquiries.unshift(data);
    return res.status(201).json({ data });
  }

  const data = await Inquiry.create(inquiry);
  return res.status(201).json({ data });
});

const listInquiries = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    return res.json({ data: memoryInquiries });
  }

  const data = await Inquiry.find().sort({ createdAt: -1 }).lean();
  return res.json({ data });
});

const updateInquiryStatus = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    const inquiry = memoryInquiries.find((item) => item._id === req.params.id);
    if (!inquiry) {
      const error = new Error("Inquiry not found.");
      error.statusCode = 404;
      throw error;
    }

    inquiry.status = req.body.status;
    inquiry.notes = req.body.notes;
    inquiry.updatedAt = new Date().toISOString();
    return res.json({ data: inquiry });
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
  listInquiries,
  updateInquiryStatus
};

