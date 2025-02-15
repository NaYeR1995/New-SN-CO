import { Router } from "express";
import { SuperAdminCheck, authenticate } from "../middleware/authMiddleware.js";
import {  } from "../middleware/authMiddleware.js";

const router = Router();
import {
  createUser,
  createSuperAdminUser,
  getAllUsers,
  banUserByID,
  updateUserByID,
  getUserByID,
  changeRoleUserByID,
} from "../Controllers/UserControllers.js";

import {
  updateUserByIDValidator,
  createSuperAdminUserValidator,
  createUserValidator,
} from "../Utils/validator/userValidator.js";

router.post("/createUser",createUserValidator, createUser);
router.post("/createSuperAdminUser",authenticate, SuperAdminCheck, createSuperAdminUserValidator, createSuperAdminUser);
router.get("/GetAllUsers",authenticate, SuperAdminCheck, getAllUsers);
router.get("/getUserByID/:id", getUserByID);
router.patch("/updateUserByID/:id",updateUserByIDValidator, updateUserByID);
router.patch("/banUserByID/:id",authenticate, SuperAdminCheck, banUserByID);
router.patch("/changeRoleUserByID/:id",authenticate, SuperAdminCheck, changeRoleUserByID);

export default router;
