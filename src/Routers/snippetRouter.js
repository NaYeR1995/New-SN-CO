import express from "express";
import { createCode } from "../Controllers/snippetController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post('/createCode', authenticate, createCode)
export default router;
