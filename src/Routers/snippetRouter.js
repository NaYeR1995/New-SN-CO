import express from "express";
import {
  createCode,
  getUserCodes,
  getCodeById,
  getCodesByCategory,
} from "../Controllers/snippetController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/createCode", authenticate, createCode); // Create a new code
router.get("/getUserCodes", authenticate, getUserCodes); // Get all codes for a user
router.get("/getCodeById/:codeId", authenticate, getCodeById); // Get a specific code by its ID
router.get("/getCodesByCategory/:categoryId", authenticate, getCodesByCategory); // Get all codes by category

export default router;
