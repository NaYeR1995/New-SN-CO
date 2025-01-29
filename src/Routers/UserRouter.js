import { Router } from "express";
import { SuperAdminCheck } from "../middleware/authMiddleware.js";

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

router.post("/createUser", createUser);
router.post("/createSuperAdminUser", SuperAdminCheck, createSuperAdminUser);
router.get("/GetAllUsers", SuperAdminCheck, getAllUsers);
router.get("/getUserByID/:id", getUserByID);
router.patch("/updateUserByID/:id", updateUserByID);
router.patch("/banUserByID/:id", SuperAdminCheck, banUserByID);
router.patch("/changeRoleUserByID/:id", SuperAdminCheck, changeRoleUserByID);

export default router;
