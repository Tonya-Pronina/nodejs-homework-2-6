const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    // name: {
    //   type: String,
    //   required: [true, "Set name for contact"],
    // },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: String,
    avatarURL: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const userRegisterSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegExp).messages({
    "any.required": `"email" must be exist`,
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": `"password" must be exist`,
  }),
  subscription: Joi.string()
    .valid(...subscriptionList)
    .messages({
      "any.required": `"subscription" must be exist`,
    }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "any.required": `"email" must be exist`,
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": `"password" must be exist`,
  }),
});

const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  userRegisterSchema,
  userLoginSchema,
  userEmailSchema,
};
