const express = require("express");

const router = express.Router();

const {
  getAll,
  getByID,
  add,
  removeById,
  updateById,
} = require("../../controllers");
const isEmptyBody = require("../../middlewares");
const schema = require("../../schemas");
const { validateData } = require("../../decorators");

router.get("/", getAll);

router.get("/:contactId", getByID);

router.post("/", isEmptyBody, validateData(schema), add);

router.delete("/:contactId", removeById);

router.put("/:contactId", isEmptyBody, validateData(schema), updateById);

module.exports = router;
