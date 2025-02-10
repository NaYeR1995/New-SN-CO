import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";

export const loginUserValidator = [
  check("Email")
    .notEmpty()
    .withMessage("Email Is Require")
    .isEmail()
    .withMessage("Enter a Valid Email "),
  check("Password").notEmpty().withMessage("Password Is Require"),
  validatorMiddleware,
];
