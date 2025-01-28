import express from "express";
import { loginUser, refreshAccessToken, logoutUser } from "../Controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authenticate, logoutUser);

export default router;
