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

const listContent = async ({ model, filter, sort }) => {
  if (!isMongoConnected()) {
    return [];
  }

  return model.find(filter).sort(sort).lean();
};

const getContentById = async ({ model, id, resourceName }) => {
  if (!isMongoConnected()) {
    throw databaseUnavailable();
  }

  const document = await model.findById(id).lean();
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
  deleteContent,
  getContentById,
  listContent,
  updateContent
};
