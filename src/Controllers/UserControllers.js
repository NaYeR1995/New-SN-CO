import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const getUserDATA = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        FullName: true,
        Email: true,
        Role: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// @desc    Create New User
// @route   Post /v1/snippet/createUs
// @access  public
export const createUser = async (req, res) => {
  try {
    const { FullName, Email, Password } = req.body;

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(Password, salt);

    const newUser = await prisma.user.create({
      data: { FullName, Email, Password: hashedPassword },
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    List All User
// @route   Post /v1/snippet/GetAllUser
// @access  Admin
export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        FullName: true,
        Email: true,
        Role: true,
        CreatedAt: true,
        UpdatedAt: true,
        Active: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get User data
// @route   Post /v1/snippet/getUserByID
// @access  admin
export const getUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserDATA(id); // Capture the result

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    put User data
// @route   Post /v1/snippet/getUserByID
// @access  public
export const updateUserByID = async (req, res) => {
  const { FullName, Email, Password } = req.body;
  const { id } = req.params;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(Password, salt);

  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: { FullName, Email, Password: hashedPassword },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Pan User User
// @route   Post /v1/snippet/getUserByID
// @access  admin
export const banUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: { Active: false }, // Assuming 'Active' is a boolean flag
    });

    res.status(200).json({ message: "User banned successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Change user Role
// @route   Post /v1/snippet/getUserByID
// @access  admin
export const changeRoleUserByID = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserDATA(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user's role is SuperAdmin
    if (user.Role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "Only SuperAdmin can access this operation" });
    }

    // Update the role (or any other user property) as required
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { Role: "Admin" }, 
    });

    res
      .status(200)
      .json({ message: "User role updated successfully", updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
