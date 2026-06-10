const formatIssues = (issues) =>
  issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = new Error("Validation failed.");
    error.statusCode = 400;
    error.details = formatIssues(result.error.issues);
    return next(error);
  }

  req.body = result.data;
  return next();
};

const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const error = new Error("Invalid route parameter.");
    error.statusCode = 400;
    error.details = formatIssues(result.error.issues);
    return next(error);
  }

  req.params = result.data;
  return next();
};

module.exports = {
  validateBody,
  validateParams
};

