const express = require("express");
const authRouter = express.Router();
const { authVerification, upload } = require("../../middlewares");

const authController = require("../../controllers/auth-controllers");

const { validateData } = require("../../decorators");
const {
  userRegisterSchema,
  userLoginSchema,
  userEmailSchema,
} = require("../../models");

authRouter.post(
  "/register",
  upload.single("avatarURL"),
  validateData(userRegisterSchema),
  authController.register
);

authRouter.get("/verify/:verificationToken", authController.verifyEmail);

authRouter.post(
  "/verify",
  validateData(userEmailSchema),
  authController.resendVerify
);
authRouter.post("/login", validateData(userLoginSchema), authController.login);

authRouter.post("/logout", async (req, res, next) => {
  try {
    await authVerification(req, res, next);
    await authController.logout(req, res);
  } catch (error) {
    next(error);
  }
});

authRouter.get("/current", async (req, res, next) => {
  try {
    await authVerification(req, res, next);
    await authController.getCurrent(req, res);
  } catch (error) {
    next(error);
  }
});

authRouter.patch(
  "/avatars",
  authVerification,
  upload.single("avatar"),
  authController.updateAvatar
);

module.exports = authRouter;
