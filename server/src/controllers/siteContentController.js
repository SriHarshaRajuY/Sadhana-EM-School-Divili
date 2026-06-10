const SiteContent = require("../models/SiteContent");
const { isMongoConnected } = require("../config/database");
const asyncHandler = require("../middleware/asyncHandler");
const { databaseUnavailable } = require("../services/contentService");

const SITE_CONTENT_KEY = "primary";

const getSiteContent = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const data = await SiteContent.findOne({ singletonKey: SITE_CONTENT_KEY }).lean();
  res.json({ data: data || null });
});

const updateSiteContent = asyncHandler(async (req, res) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const data = await SiteContent.findOneAndUpdate(
    { singletonKey: SITE_CONTENT_KEY },
    {
      $set: {
        ...req.body,
        singletonKey: SITE_CONTENT_KEY
      }
    },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true
    }
  );

  res.json({ data });
});

module.exports = {
  getSiteContent,
  updateSiteContent
};
