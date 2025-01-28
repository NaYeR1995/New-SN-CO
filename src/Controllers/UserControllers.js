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
        Active: true,
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
// @route   Post /api/v1/user/createUser
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

// @desc    Create New User
// @route   Post /api/v1/user/createUser
// @access  admin
export const createSuperAdminUser = async (req, res) => {
  try {
    const { FullName, Email, Password} = req.body;

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(Password, salt);

    const newUser = await prisma.user.create({
      data: { FullName, Email, Password: hashedPassword, Role: "SuperAdmin" },
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    List All Users
// @route   get /api/v1/user/GetAllUser
// @access  Admin
export const getAllUsers = async (req, res) => {
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
// @route   get /api/v1/user//getUserByID
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
// @route   patch /api/v1/user/updateUserByID
// @access  public
export const updateUserByID = async (req, res) => {
  const { FullName, Email, Password } = req.body;
  const { id } = req.params;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(Password, salt);

  try {
    const user = await prisma.user.update({
      where: { id: id },
      select: {
        id: true,
        FullName: true,
        Email: true,
        Role: true,
        Active: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
      data: { FullName, Email, Password: hashedPassword },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Pan User User
// @route   patch /api/v1/user/banUserByID
// @access  admin
export const banUserByID = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserDATA(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.Active === false) {
      const user = await prisma.user.update({
        where: { id },
        select: {
          id: true,
          FullName: true,
          Email: true,
          Role: true,
          Active: true,
          CreatedAt: true,
          UpdatedAt: true,
        },
        data: { Active: true }, 
      });
      res.status(200).json({ message: "User Unbanned successfully", user });
    } else if (user.Active === true) {
      const user = await prisma.user.update({
        where: { id },
        select: {
          id: true,
          FullName: true,
          Email: true,
          Role: true,
          Active: true,
          CreatedAt: true,
          UpdatedAt: true,
        },
        data: { Active: false }, 
      });
      res.status(200).json({ message: "User banned successfully", user });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while banning the user",
      details: error.message,
    });
  }
};

// @desc    Change user Role
// @route   patch /api/v1/user/changeRoleUserByID
// @access  admin
export const changeRoleUserByID = async (req, res) => {
  const { id } = req.params; // ID of the user whose role needs to be changed
  const { Role } = req.body; // The new role to assign (e.g., "Admin" or "SuperAdmin")
  const requestingUser = req.user; // Extracted from the token after authentication middleware

  try {

    // Fetch the target user
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent demoting a SuperAdmin to a non-SuperAdmin role if the target user is a SuperAdmin
    if (user.Role === "SuperAdmin" && Role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "Cannot demote a SuperAdmin to a lower role" });
    }

    // Prevent SuperAdmins from changing their own role
    if (requestingUser.id === user.id) {
      return res
        .status(403)
        .json({ message: "SuperAdmin cannot change their own role" });
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { Role },
      select: {
        id: true,
        FullName: true,
        Email: true,
        Role: true,
        Active: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
    });

    res
      .status(200)
      .json({ message: "User role updated successfully", updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

