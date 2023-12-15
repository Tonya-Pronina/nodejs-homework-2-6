const express = require("express");
const authRouter = express.Router();
const authVerification = require("../../middlewares");

const authController = require("../../controllers/auth-controllers");

const { validateData } = require("../../decorators");
const { userRegisterSchema, userLoginSchema } = require("../../models");

authRouter.post(
  "/register",
  validateData(userRegisterSchema),
  authController.register
);

authRouter.post("/login", validateData(userLoginSchema), authController.login);

authRouter.get("/logout", async (req, res, next) => {
  try {
    await authVerification(req, res);
    await authController.logout(req, res);
  } catch (error) {
    next(error);
  }
});

authRouter.get("/current", async (req, res, next) => {
  try {
    await authVerification(req, res);
    await authController.getCurrent(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
