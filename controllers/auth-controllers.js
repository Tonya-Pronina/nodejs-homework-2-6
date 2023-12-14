const User = require("../models");

const HttpError = require("../helpers");
const { decorateController } = require("../decorators");

const register = async (req, res) => {
  //   const { email, password } = req.body;
  //   const user = await User.findOne({ email });
  //   if (user) {
  //     throw HttpError(409, `Email ${email} already in use`);
  //   }
  //   const hashPassword = await bcrypt.hash(password, 10);
  //   const newUser = await User.create({ ...req.body, password: hashPassword });
  //   res.status(201).json({
  //     email: newUser.email,
  //     name: newUser.name,
  //   });
};

module.exports = {
  register: decorateController(register),
};
