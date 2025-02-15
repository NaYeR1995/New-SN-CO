import { PrismaClient } from "@prisma/client";
import { generateTokens } from "./jwtUtils.js";
import asyncHandler from "express-async-handler";
import { setAuthCookies } from "../Controllers/authController.js";
import {verifyAccessToken} from "./jwtUtils.js";
const prisma = new PrismaClient();

// Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(404).json({ message: "You Must Login!" });
  }

  try {
    // Generate a new access token
    const user = verifyAccessToken(refreshToken);
    const { accessToken } = generateTokens(user);
    
    // Set the new access token in cookies
    setAuthCookies(res, accessToken);
    req.user = user;
    next();

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    return res.status(401).json({ message: `You Must Login!` });
  }
});
