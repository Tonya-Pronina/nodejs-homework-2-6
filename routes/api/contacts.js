const express = require("express");

const router = express.Router();

const contacts = require("../../controllers/contacts-controllers");

const { validateData } = require("../../decorators");
const { addSchema, updateFavoriteSchema } = require("../../models");
const { isValidId, authVerification } = require("../../middlewares");

router.use(authVerification);

router.get("/", contacts.getAll);

router.get("/:id", (res, req, err) => {
  if (err) return err;
  return isValidId(contacts.getByID);
});

router.post("/", validateData(addSchema), contacts.addContact);

router.put("/:id", async (req, res, next) => {
  try {
    await isValidId(req, res);
    await validateData(updateFavoriteSchema)(req, res);
    await contacts.updateByID(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/favorite", async (req, res, next) => {
  try {
    await isValidId(req, res);
    await validateData(updateFavoriteSchema)(req, res);
    await contacts.updateFavorite(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await isValidId(req, res);
    await contacts.removeById(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
