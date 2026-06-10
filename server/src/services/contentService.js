const { isMongoConnected } = require("../config/database");

const databaseUnavailable = () => {
  const error = new Error("Database is not configured or not connected.");
  error.statusCode = 503;
  return error;
};

const notFound = (resourceName) => {
  const error = new Error(`${resourceName} not found.`);
  error.statusCode = 404;
  return error;
};

const normalizePositiveInteger = (value, fallback) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

const normalizePagination = ({ page = 1, limit = 50 } = {}) => {
  const normalizedPage = normalizePositiveInteger(page, 1);
  const normalizedLimit = Math.min(normalizePositiveInteger(limit, 50), 100);

  return {
    limit: normalizedLimit,
    page: normalizedPage,
    skip: (normalizedPage - 1) * normalizedLimit
  };
};

const listContent = async ({ model, filter = {}, sort = { createdAt: -1 }, page, limit }) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const pagination = normalizePagination({ page, limit });
  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(pagination.skip).limit(pagination.limit).lean(),
    model.countDocuments(filter)
  ]);

  return {
    data,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / pagination.limit))
    }
  };
};

const getContentById = async ({ model, id, resourceName, filter = {} }) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const document = await model.findOne({ _id: id, ...filter }).lean();
  if (!document) {
    throw notFound(resourceName);
  }

  return document;
};

const createContent = async ({ model, data }) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  return model.create(data);
};

const updateContent = async ({ model, id, data, resourceName }) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const document = await model.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });

  if (!document) {
    throw notFound(resourceName);
  }

  return document;
};

const deleteContent = async ({ model, id, resourceName }) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const document = await model.findByIdAndDelete(id);
  if (!document) {
    throw notFound(resourceName);
  }

  return document;
};

module.exports = {
  createContent,
  databaseUnavailable,
  deleteContent,
  getContentById,
  listContent,
  normalizePagination,
  updateContent
};
