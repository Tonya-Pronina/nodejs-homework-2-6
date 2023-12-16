const { User } = require("../models");
const dotenv = require("dotenv");
const { HttpError } = require("../helpers/HttpError");
const jwt = require("jsonwebtoken");
const { decorateController } = require("../decorators/ctrlWrapper");

dotenv.config();

const authVerification = decorateController(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (!authorization || !authorization.startsWith("Bearer ") || !token) {
    throw HttpError(401, "Not authorized");
  }

  const { SECRET_KEY } = process.env;

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }
    req.user = user;

    next();
  } catch (error) {
    throw HttpError(401, error.message);
  }
});

module.exports = authVerification;
