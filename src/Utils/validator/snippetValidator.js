import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const XXXXX = [, validatorMiddleware];

// title, Code, Language, Description, Category
export const createCodeValidator = [
  check("title").notEmpty().withMessage("title Is Required"),
  check("Code").notEmpty().withMessage("Code Is Required"),
  check("Language").notEmpty().withMessage("Language Is Required"),
  check("Description").notEmpty().withMessage("Description Is Required"),
  check("Category").notEmpty().withMessage("Category Is Required"),
  validatorMiddleware,
];
export const updateCodeValidator = [
  check("title").notEmpty().optional().withMessage("title Is Required"),
  check("Code").notEmpty().optional().withMessage("Code Is Required"),
  check("Language").notEmpty().optional().withMessage("Language Is Required"),
  check("Description").notEmpty().optional().withMessage("Description Is Required"),
  check("Category").notEmpty().optional().withMessage("Category Is Required"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check("Category").notEmpty().withMessage("Category Is Required"),
  validatorMiddleware,
];
