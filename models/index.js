const { addSchema, updateFavoriteSchema, Contact } = require("./Contacts");

const { User, userRegisterSchema, userLoginSchema } = require("./User");

module.exports = {
  addSchema,
  updateFavoriteSchema,
  Contact,
  User,
  userRegisterSchema,
  userLoginSchema,
};
