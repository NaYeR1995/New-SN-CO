import { PrismaClient } from "@prisma/client";
import { generateTokens } from "./jwtUtils.js";
import asyncHandler from "express-async-handler";
import { setAuthCookies } from "../Controllers/authController.js";
const prisma = new PrismaClient();

// Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(404).json({ message: "You Must Login!" });
  }

  const timeNow = Date.now();
  const user = await prisma.user.findFirst({
    where: {
      refreshToken: refreshToken,
      refreshTokenExpiry: {
        lte: timeNow,
      },
    },
  });
  if (!user) return res.status(404).json({ message: "expired Refresh Token" });

  // Generate a new access token
  const { accessToken } = generateTokens(user);

  // Set the new access token in cookies
  setAuthCookies(res, accessToken);
  req.user = user;
  next();

  res.status(200).json({ message: "Token refreshed successfully" });

  // Return the new access token
  return accessToken;
});
