import { PrismaClient } from "@prisma/client";
import { generateTokens } from "../Utils/authUtils.js";
import asyncHandler from "express-async-handler";
import { setAuthCookies } from "../Controllers/authController.js";
const prisma = new PrismaClient();

// Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh Token expired" });

  const timeNow = Date.now();
  const user = await prisma.user.findFirst({
    where: {
      refreshToken: refreshToken,
      refreshTokenExpiry: {
        lte: timeNow,
      },
    },
  });
  if (!user) return res.status(404).json({ message: "Invalid Refresh Token" });

  // Generate a new access token
  const { accessToken } = generateTokens(user);

  // Set the new access token in cookies
  setAuthCookies(res, accessToken);

  res.status(200).json({ message: "Token refreshed successfully" });

  // Return the new access token
  return accessToken;
});
