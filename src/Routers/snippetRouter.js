import express from "express";
import {
  createCode,
  getUserCodes,
  getCodeById,
  getCodesByCategory,
  updateCode,
  deleteCode,
  getCategoriesByUserId

} from "../Controllers/snippetController.js";

const router = express.Router();
router.post("/createCode", createCode); 
router.get("/getUserCodes", getUserCodes); 
router.get("/getCodesByCategory/:categoryId", getCodesByCategory); 
router.patch("/updateCode/:codeId", updateCode);
router.get("/getCodeById/:codeId", getCodeById); 
router.get("/getCategoriesByUserId", getCategoriesByUserId); 
router.delete("/deleteCode/:codeId", deleteCode);

export default router;
