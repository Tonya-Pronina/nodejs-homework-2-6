const { addSchema, updateFavoriteSchema, Contact } = require("./Contacts");

const {
  User,
  userRegisterSchema,
  userLoginSchema,
  userEmailSchema,
} = require("./User");

module.exports = {
  addSchema,
  updateFavoriteSchema,
  Contact,
  User,
  userRegisterSchema,
  userLoginSchema,
  userEmailSchema,
};
