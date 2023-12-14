const { addSchema, updateFavoriteSchema, Contact } = require("./Contacts");

module.exports = {
  addSchema,
  updateFavoriteSchema,
  Contact,
};

const { User, userRegisterSchema, userLoginSchema } = require("./User");

module.exports = {
  User,
  userRegisterSchema,
  userLoginSchema,
};
