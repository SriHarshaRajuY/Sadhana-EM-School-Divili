const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    classInterest: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: ""
    },
    studentName: {
      type: String,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    source: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "website"
    },
    status: {
      type: String,
      enum: ["new", "contacted", "visit_scheduled", "admitted", "closed"],
      default: "new"
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1200
    },
    metadata: {
      ip: String,
      userAgent: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ phone: 1, createdAt: -1 });

module.exports = mongoose.model("Inquiry", inquirySchema);

