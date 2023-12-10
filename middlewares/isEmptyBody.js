const HttpError = require("../helpers");

const isEmptyBody = (req, res, next) => {
  const dataKeys = Object.keys(req.body).length > 0;
  if (!dataKeys) {
    return next(HttpError(400, "missing fields"));
  }
  return next();
};

module.exports = isEmptyBody;
