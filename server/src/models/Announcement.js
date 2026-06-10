const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  },
  {
    timestamps: true,
    versionKey: false
  }
);

announcementSchema.index({ isPublished: 1, priority: -1, publishedAt: -1 });

module.exports = mongoose.model("Announcement", announcementSchema);

