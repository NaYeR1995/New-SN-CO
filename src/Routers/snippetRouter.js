import express from "express";
import {
  createCode,
  getUserCodes,
  getCodeById,
  getCodesByCategory,
  updateCode,
  deleteCode

} from "../Controllers/snippetController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/createCode", authenticate, createCode); 
router.get("/getUserCodes", authenticate, getUserCodes); 
router.get("/getCodesByCategory/:categoryId", authenticate, getCodesByCategory); 
router.patch("/updateCode/:codeId", authenticate, updateCode);
router.get("/getCodeById/:codeId", authenticate, getCodeById); 
router.delete("/deleteCode/:codeId", authenticate, deleteCode);

export default router;
