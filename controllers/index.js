const {
  getAll,
  getByID,
  addContact,
  updateByID,
  updateFavorite,
  removeById,
} = require("./contacts-controllers");

const {
  register,
  login,
  getCurrent,
  logout,
  verifyEmail,
  resendVerify,
} = require("./auth-controllers");

module.exports = {
  getAll,
  getByID,
  addContact,
  removeById,
  updateByID,
  updateFavorite,
  register,
  login,
  getCurrent,
  logout,
  verifyEmail,
  resendVerify,
};
