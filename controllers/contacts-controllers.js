const { Contact } = require("../models/Contacts");

const HttpError = require("../helpers/HttpError");
const { decorateController } = require("../decorators/ctrlWrapper");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name subscription");
  res.json(result);
};

const getByID = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.getContactById(contactId, owner);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json({
    message: "Delete success",
  });
};

const updateByID = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.updateContact(contactId, req.body, owner, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

const updateFavorite = updateByID;

module.exports = {
  getAll: decorateController(getAll),
  getByID: decorateController(getByID),
  addContact: decorateController(add),
  updateByID: decorateController(updateByID),
  updateFavorite: decorateController(updateFavorite),
  removeById: decorateController(removeById),
};
