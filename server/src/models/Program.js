const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200
    },
    grades: {
      type: String,
      trim: true,
      maxlength: 120
    },
    highlights: {
      type: [String],
      default: []
    },
    order: {
      type: Number,
      default: 0
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

programSchema.index({ isPublished: 1, order: 1, title: 1 });

module.exports = mongoose.model("Program", programSchema);

