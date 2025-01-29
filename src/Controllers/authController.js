import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateTokens } from "../Utils/authUtils.js";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// Helper to set cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: true,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper to handle errors
const handleError = (res, error) => res.status(400).json({ error: error.message });

// Login Function
export const loginUser = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  const user = await prisma.user.findUnique({ where: { Email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordValid = bcrypt.compareSync(Password, user.Password);
  if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Store refresh token in DB
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  // Set tokens in cookies
  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({ message: "Login successful", user: user.Email, Role: user.Role });
});

// Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "Refresh Token expired" });

  const user = await prisma.user.findFirst({ where: { refreshToken } });

  if (!user) return res.status(403).json({ message: "Invalid Refresh Token" });

  // Generate a new access token
  const { accessToken } = generateTokens(user);

  // Set the new access token in cookies
  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({ message: "Token refreshed successfully" });
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  // Clear refresh token in DB
  await prisma.user.update({ where: { id }, data: { refreshToken: null } });

  // Clear cookies
  res.clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Logged out successfully" });
});
