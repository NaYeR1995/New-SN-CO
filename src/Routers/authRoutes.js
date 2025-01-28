import express from "express";
import { loginUser, refreshAccessToken, logoutUser } from "../Controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/v1/user/login", loginUser);
router.post("v1/user/refresh-token", refreshAccessToken);
router.post("v1/user//logout", authenticate, logoutUser);

export default router;
