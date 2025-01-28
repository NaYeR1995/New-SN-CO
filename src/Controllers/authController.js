import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateTokens, verifyRefreshToken } from "../Utils/authUtils.js";

const prisma = new PrismaClient();

// @desc    login
// @route   Post /v1/snippet/getUserByID
// @access  public
// Login Function
export const loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.user.findUnique({
      where: { Email: Email },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = bcrypt.compareSync(Password, user.Password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    // Store refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    // Set tokens in secure cookies
    res;
    // Access token available for frontend use
    res
      .cookie("accessToken", accessToken, {
        httpOnly: false, // Accessible by frontend JavaScript
        secure: true, // Only send over HTTPS (enable in production)
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      // Keep refresh token secure and hidden
      .cookie("refreshToken", refreshToken, {
        httpOnly: true, // Keep refresh token secure from JavaScript access
        secure: true, // Enable in production for HTTPS
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({ message: "Login successful", user: user.Email, Role: user.Role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh Token expired" });

  try {
    const user = await prisma.user.findFirst({ where: { refreshToken } });

    if (!user)
      return res.status(403).json({ message: "Invalid Refresh Token" });

    // Generate a new access token using the existing refresh token
    const { accessToken } = generateTokens(user);

    // Set the new access token in cookies
    res
    .cookie("accessToken", accessToken, {
      httpOnly: false, // Accessible by frontend JavaScript
      secure: true, // Only send over HTTPS (enable in production)
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
      .status(200)
      .json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    const { id } = req.user;
    // Store refresh token in DB
    await prisma.user.update({
      where: { id: id },
      data: { refreshToken: null },
    });
    // Clear both tokens
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
