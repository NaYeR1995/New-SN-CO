import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateTokens, verifyRefreshToken } from "../Utils/authUtils.js";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// Helper to set cookies
export const setAuthCookies = (res, accessToken, refreshToken = null) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  } else {
    console.log("No refreshToken provided");
  }
};

// Login Function
export const loginUser = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      Email: Email,
    },
  });
  if (!user)
    return res.status(404).json({ message: "Email Or Password Is Wrong" });
  if (user.IsBan) return res.status(403).json({ message: "User is banned" });

  const isPasswordValid = bcrypt.compareSync(Password, user.Password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Email Or Password Is Wrong" });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);
  const decoded = verifyRefreshToken(refreshToken)

  // Store refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, refreshTokenExpiry: (decoded.exp*1000) },
  });

  // Set tokens in cookies
  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json({ message: "Login successful", user: user.Email, Role: user.Role });
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  // Clear refresh token in DB
  await prisma.user.update({ where: { id }, data: { refreshToken: null } });

  // Clear cookies
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Logged out successfully" });
});
