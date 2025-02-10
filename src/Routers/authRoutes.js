import express from "express";
import {
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../Controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { loginUserValidator } from "../Utils/validator/authValidator.js";

const router = express.Router();

router.post("/login", loginUserValidator, loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authenticate, logoutUser);

export default router;
