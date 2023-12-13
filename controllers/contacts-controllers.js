const { Contact } = require("../models/Contacts");

const HttpError = require("../helpers");
const { decorateController } = require("../decorators");

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getByID = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

const add = decorateController(async (req, res) => {
  const newContact = req.body;
  const result = await Contact.create(newContact);
  res.status(201).json(result);
});

const removeById = decorateController(async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `ID ${contactId} not found`);
  }
  res.json({ message: "Contact deleted" });
});

const updateByID = decorateController(async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, `ID ${contactId} not found`);
  }
  res.json(result);
});

const updateFavorite = updateByID;

module.exports = {
  getAll: decorateController(getAll),
  getByID: decorateController(getByID),
  addContact: decorateController(add),
  updateByID: decorateController(updateByID),
  updateFavorite: decorateController(updateFavorite),
  removeById: decorateController(removeById),
};
