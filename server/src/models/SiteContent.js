const mongoose = require("mongoose");

const textPairSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 80 },
    text: { type: String, trim: true, maxlength: 300 }
  },
  { _id: false }
);

const valueSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 80 },
    title: { type: String, trim: true, maxlength: 180 },
    body: { type: String, trim: true, maxlength: 600 }
  },
  { _id: false }
);

const imagePanelSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      trim: true,
      enum: ["", "large", "classroom", "activity", "wide"],
      default: ""
    },
    title: { type: String, trim: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 500 },
    imageUrl: { type: String, trim: true, maxlength: 600 },
    imagePublicId: { type: String, trim: true, maxlength: 220 },
    isPublished: { type: Boolean, default: true }
  },
  { _id: false }
);

const facilitySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 600 }
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "primary",
      immutable: true
    },
    school: {
      name: { type: String, trim: true, maxlength: 140 },
      tagline: { type: String, trim: true, maxlength: 180 },
      footerTagline: { type: String, trim: true, maxlength: 180 }
    },
    topBanner: {
      text: { type: String, trim: true, maxlength: 300 },
      admissionCtaLabel: { type: String, trim: true, maxlength: 80 }
    },
    hero: {
      eyebrow: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 160 },
      highlight: { type: String, trim: true, maxlength: 180 },
      copy: { type: String, trim: true, maxlength: 700 },
      primaryActionLabel: { type: String, trim: true, maxlength: 80 },
      secondaryActionLabel: { type: String, trim: true, maxlength: 80 },
      panels: { type: [imagePanelSchema], default: undefined }
    },
    parentTrust: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 },
      stats: { type: [textPairSchema], default: undefined }
    },
    about: {
      quote: { type: String, trim: true, maxlength: 300 },
      message: { type: String, trim: true, maxlength: 800 },
      attribution: { type: String, trim: true, maxlength: 120 },
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 1000 },
      values: { type: [valueSchema], default: undefined }
    },
    academics: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 }
    },
    facilities: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 },
      items: { type: [facilitySchema], default: undefined }
    },
    admissions: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 },
      primaryActionLabel: { type: String, trim: true, maxlength: 80 },
      secondaryActionLabel: { type: String, trim: true, maxlength: 80 },
      steps: { type: [textPairSchema], default: undefined }
    },
    updates: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 },
      noticeBoardTitle: { type: String, trim: true, maxlength: 120 }
    },
    gallery: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 },
      items: { type: [imagePanelSchema], default: undefined }
    },
    adminCopy: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 }
    },
    contact: {
      kicker: { type: String, trim: true, maxlength: 120 },
      title: { type: String, trim: true, maxlength: 240 },
      body: { type: String, trim: true, maxlength: 800 },
      campus: { type: String, trim: true, maxlength: 400 },
      phoneDisplay: { type: String, trim: true, maxlength: 80 },
      phoneTel: { type: String, trim: true, maxlength: 40 },
      whatsappUrl: { type: String, trim: true, maxlength: 600 },
      email: { type: String, trim: true, lowercase: true, maxlength: 180 },
      officeHours: { type: String, trim: true, maxlength: 180 },
      formTitle: { type: String, trim: true, maxlength: 120 },
      classOptions: { type: [String], default: undefined }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

siteContentSchema.index({ singletonKey: 1 }, { unique: true });

module.exports = mongoose.model("SiteContent", siteContentSchema);
