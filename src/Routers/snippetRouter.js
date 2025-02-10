import express from "express";
import {
  createCode,
  createCategory,
  getUserCodes,
  getCodeById,
  getCodesByCategory,
  updateCode,
  deleteCode,
  getCategoriesByUserId,
} from "../Controllers/snippetController.js";

import {
  createCodeValidator,
  createCategoryValidator,
  updateCodeValidator,
} from "../Utils/validator/snippetValidator.js";

const router = express.Router();
router.post("/createCode", createCodeValidator, createCode);
router.post("/createCategory", createCategoryValidator, createCategory);
router.get("/getUserCodes", getUserCodes);
router.get("/getCodesByCategory/:categoryId", getCodesByCategory);
router.patch("/updateCode/:codeId",updateCodeValidator, updateCode);
router.get("/getCodeById/:codeId", getCodeById);
router.get("/getCategoriesByUserId", getCategoriesByUserId);
router.delete("/deleteCode/:codeId", deleteCode);

export default router;
