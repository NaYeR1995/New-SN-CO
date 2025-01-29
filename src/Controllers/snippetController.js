import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const createCode = asyncHandler(async (req, res) => {
  const { title, Code, Language, Description, Category } = req.body;
  const { id: userId } = req.user;

  // Find or create the category for this user
  let category = await prisma.category.findFirst({
    where: {
      Name: Category,
      UserId: userId,
    },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        Name: Category,
        User: { connect: { id: userId } },
      },
    });
  }

  // Create the snippet code and associate it with the user and category
  const newCode = await prisma.snippet_code.create({
    data: {
      title,
      Code,
      Language,
      Description,
      User: { connect: { id: userId } },
      Category: { connect: { id: category.id } },
    },
  });

  res.status(200).json(newCode);
});

export const getUserCodes = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const codes = await prisma.snippet_code.findMany({
    where: { UserId: userId },
    include: { Category: true },
  });

  res.status(200).json(codes);
});


export const getCodeById = asyncHandler(async (req, res) => {
  const { codeId } = req.params;

  const code = await prisma.snippet_code.findUnique({
    where: { ID: codeId },
    include: { User: true, Category: true },
  });

  if (!code) {
    return res.status(404).json({ message: "Code not found" });
  }

  res.status(200).json(code);
});


export const getCodesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const codes = await prisma.snippet_code.findMany({
    where: { CategoryId: categoryId },
    include: { User: true, Category: true },
  });

  res.status(200).json(codes);
});


