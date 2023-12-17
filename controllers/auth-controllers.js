const { decorateController } = require("../decorators/ctrlWrapper");
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { HttpError, sendEmail, sendVerifyEmail } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarsDir = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `Email ${email} already in use`);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await sendEmail(sendVerifyEmail({ email, verificationToken }));

  res.status(201).json({
    User: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(401, "User not found or not verify");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Email verify success",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  const { verifyEmail, verificationToken } = user;
  if (verifyEmail) {
    throw HttpError(400, "Verification has already been passed");
  }

  await sendEmail(sendVerifyEmail({ email, verificationToken }));

  res.json({
    message: `${email} - email resend success`,
    email: email,
  });
};

const login = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const { verifyEmail } = user;
  if (!verifyEmail) {
    throw HttpError(401, "User not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  console.log(passwordCompare);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user.id,
  };
  if (!user.verifyEmail) {
    throw HttpError(404, "User not found or not verithication");
  }

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;

  res.json({
    email,
    subscription,
    avatarURL,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const img = await Jimp.read(tempUpload);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tempUpload);

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
};

module.exports = {
  register: decorateController(register),
  login: decorateController(login),
  getCurrent: decorateController(getCurrent),
  logout: decorateController(logout),
  updateAvatar: decorateController(updateAvatar),
  verifyEmail: decorateController(verifyEmail),
  resendVerify: decorateController(resendVerify),
};
