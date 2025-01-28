import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { FullName, Email, Password } = req.body;
    
    const salt = bcrypt.genSaltSync(10);
    
    const hashedPassword =  bcrypt.hashSync(Password, salt);

    const newUser = await prisma.user.create({
      data: { FullName, Email, Password: hashedPassword }, 
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        FullName: true,
        Email: true,
        Role: true,
        CreatedAt: true,
        UpdatedAt: true
      }
    });
    res.status(200).json(users); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

