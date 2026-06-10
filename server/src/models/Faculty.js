const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    department: {
      type: String,
      trim: true,
      maxlength: 120
    },
    qualifications: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1200
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40
    },
    photoUrl: {
      type: String,
      trim: true,
      maxlength: 600
    },
    photoPublicId: {
      type: String,
      trim: true,
      maxlength: 220
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

facultySchema.index({ isActive: 1, order: 1, name: 1 });

module.exports = mongoose.model("Faculty", facultySchema);
