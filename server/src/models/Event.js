const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200
    },
    startsAt: {
      type: Date,
      required: true
    },
    endsAt: Date,
    location: {
      type: String,
      trim: true,
      maxlength: 180
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80
    },
    imageUrl: {
      type: String,
      trim: true,
      maxlength: 600
    },
    imagePublicId: {
      type: String,
      trim: true,
      maxlength: 220
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

eventSchema.index({ isPublished: 1, startsAt: 1 });

module.exports = mongoose.model("Event", eventSchema);
