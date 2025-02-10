import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// Reusable user selection fields
const userSelectFields = {
  id: true,
  FullName: true,
  Email: true,
  Role: true,
  Active: true,
  IsBan: true,
  CreatedAt: true,
  UpdatedAt: true,
};

// Helper: Hash password
const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Helper: Handle errors
const handleError = (res, error) =>
  res.status(400).json({ error: error.message });

// Helper: Fetch user by ID with selected fields
const getUserDATA = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: userSelectFields,
  });
};

// @desc    Create New User
// @route   Post /api/v1/user/createUser
// @access  public
export const createUser = asyncHandler(async (req, res) => {
  const { FullName, Email, Password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { Email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Hash password securely
  const hashedPassword = await hashPassword(Password);

  // Create new user
  const newUser = await prisma.user.create({
    data: { FullName, Email, Password: hashedPassword },
    select: userSelectFields,
  });

  res.status(201).json(newUser);
});

// @desc    Create Super Admin User
// @route   Post /api/v1/user/createSuperAdminUser
// @access  admin
export const createSuperAdminUser = asyncHandler(async (req, res) => {
  const { FullName, Email, Password } = req.body;
  const hashedPassword = hashPassword(Password);

  const newUser = await prisma.user.create({
    data: { FullName, Email, Password: hashedPassword, Role: "SuperAdmin" },
    select: userSelectFields,
  });

  res.status(200).json(newUser);
});

// @desc    List All Users
// @route   get /api/v1/user/GetAllUser
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({ select: userSelectFields });
  res.status(200).json(users);
});

// @desc    Get User data
// @route   get /api/v1/user/getUserByID
// @access  admin
export const getUserByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getUserDATA(id);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json(user);
});

// @desc    Update User data
// @route   patch /api/v1/user/updateUserByID
// @access  public
export const updateUserByID = asyncHandler(async (req, res) => {
  const { FullName, Email, Password } = req.body;
  const { id } = req.params;
  const hashedPassword = hashPassword(Password);

  const user = await prisma.user.update({
    where: { id },
    select: userSelectFields,
    data: { FullName, Email, Password: hashedPassword },
  });

  res.status(200).json(user);
});

// @desc    Ban/Unban User
// @route   patch /api/v1/user/banUserByID
// @access  admin
export const banUserByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getUserDATA(id);

  if (!user) return res.status(404).json({ message: "User not found" });

  const updatedUser = await prisma.user.update({
    where: { id },
    select: userSelectFields,
    data: { IsBan: !user.IsBan },
  });

  const statusMessage = updatedUser.IsBan
    ? "User banned successfully"
    : "User Unbanned successfully";
  res.status(200).json({ message: statusMessage, user: updatedUser });
});

// @desc    Change User Role
// @route   patch /api/v1/user/changeRoleUserByID
// @access  admin
export const changeRoleUserByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { Role } = req.body;
  const requestingUser = req.user;

  const user = await getUserDATA(id);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.Role === "SuperAdmin" && Role !== "SuperAdmin") {
    return res
      .status(403)
      .json({ message: "Cannot demote a SuperAdmin to a lower role" });
  }

  if (requestingUser.id === user.id) {
    return res
      .status(403)
      .json({ message: "SuperAdmin cannot change their own role" });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { Role },
    select: userSelectFields,
  });

  res
    .status(200)
    .json({ message: "User role updated successfully", updatedUser });
});
