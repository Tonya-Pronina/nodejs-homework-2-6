const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../models");

const HttpError = require("../helpers");
const { decorateConrtoler } = require("../decorators");

const getAll = async (req, res, next) => {
  const result = await listContacts();
  res.json(result);
};

const getByID = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);
  if (!result) {
    throw HttpError(404, `ID ${contactId} not found`);
  }
  res.json(result);
};

const add = async (req, res, next) => {
  const newContact = req.body;
  const result = await addContact(newContact);
  res.status(201).json(result);
};

const removeById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  if (!result) {
    throw HttpError(404, `ID ${contactId} not found`);
  }
  res.json({ message: "Contact deleted" });
};

const updateById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, `ID ${contactId} not found`);
  }
  res.json(result);
};

module.exports = {
  getAll: decorateConrtoler(getAll),
  getByID: decorateConrtoler(getByID),
  add: decorateConrtoler(add),
  removeById: decorateConrtoler(removeById),
  updateById: decorateConrtoler(updateById),
};
