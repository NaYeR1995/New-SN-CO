import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUserValidator = [
  check("FullName")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long"),

  check("Email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await prisma.user.findUnique({
        where: { Email: val },
      });
      if (user) {
        return Promise.reject(new Error("E-mail is already registered"));
      }
    }),

  check("Password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (e.g., @$!%*?&)"
    ),

  validatorMiddleware,
];


export const createSuperAdminUserValidator =  [
    check("FullName")
      .notEmpty()
      .withMessage("User name is required")
      .isLength({ min: 3 })
      .withMessage("User name must be at least 3 characters long"),
  
    check("Email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address")
      .custom(async (val) => {
        const user = await prisma.user.findUnique({
          where: { Email: val },
        });
        if (user) {
          return Promise.reject(new Error("E-mail is already registered"));
        }
      }),
  
    check("Password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&]/)
      .withMessage(
        "Password must contain at least one special character (e.g., @$!%*?&)"
      ),
  
    validatorMiddleware,
  ];
  
export const updateUserByIDValidator = [
    check("FullName").optional()
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long"),

  check("Email").optional()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await prisma.user.findUnique({
        where: { Email: val },
      });
      if (user) {
        return Promise.reject(new Error("E-mail is already registered"));
      }
    }),

  check("Password").optional()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (e.g., @$!%*?&)"
    ),

  validatorMiddleware,
];


