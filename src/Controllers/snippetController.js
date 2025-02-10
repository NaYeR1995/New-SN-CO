import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const codeData = {
  User: {
    select: {
      id: true,
      FullName: true,
      Email: true,
    },
  },
  Category: {
    select: {
      Name: true,
      id: true,
    },
  },
}

const findOrCreateCategory = async (prisma, userId, categoryName) => {
  let category = await prisma.category.findFirst({
    where: {
      Name: categoryName,
      UserId: userId,
    },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        Name: categoryName,
        User: { connect: { id: userId } },
      },
    });
  }

  return category;
};

export const createCode = asyncHandler(async (req, res) => {
  const { title, Code, Language, Description, Category } = req.body;
  const { id: userId } = req.user;
  if (!title || !Code || !Language || !Description || !Category) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Find or create the category for this user
  const category = await findOrCreateCategory(prisma, userId, Category);


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

export const createCategory = asyncHandler(async (req, res) => {
  const { Category } = req.body;
  const { id: userId } = req.user;
  if (!Category) {
    return res.status(400).json({ message: "Category Is required" });
  }

  // Use the utility function to find or create category
  const category = await findOrCreateCategory(prisma, userId, Category);

  res.status(200).json(category);
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
    include: codeData,
  });

  if (!code) {
    return res.status(404).json({ message: "Code not found" });
  }

  res.status(200).json(code);
});

export const getCodesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const codes = await prisma.snippet_code.findMany({
    where: { CategoryId: categoryId }, include: codeData,

  });

  res.status(200).json(codes);
});

export const updateCode = asyncHandler(async (req, res) => {
  const { codeId } = req.params;
  const { title, Code, Language, Description, Category } = req.body;

  // Check if the code exists
  const existingCode = await prisma.snippet_code.findUnique({
    where: { ID: codeId },
  });

  if (!existingCode) {
    return res.status(404).json({ message: "Code not found" });
  }

  let categoryId = existingCode.CategoryId;

  // Update category if provided
  if (Category) {
    const category = await findOrCreateCategory(prisma, req.user.id, Category);
    categoryId = category.id;
  }

  const updatedCode = await prisma.snippet_code.update({
    where: { ID: codeId },
    data: {
      title,
      Code,
      Language,
      Description,
      CategoryId: categoryId,
    },
    include: codeData
  });

  res.status(200).json({ message: "Code updated successfully", updatedCode });
});

export const deleteCode = asyncHandler(async (req, res) => {
  const { codeId } = req.params;

  // Check if the code exists
  const existingCode = await prisma.snippet_code.findUnique({
    where: { ID: codeId },
  });

  if (!existingCode) {
    return res.status(404).json({ message: "Code not found" });
  }

  await prisma.snippet_code.delete({
    where: { ID: codeId },
  });

  res.status(200).json({ message: "Code deleted successfully" });
});

export const getCategoriesByUserId = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const codes = await prisma.category.findMany({
    where: { UserId: userId },
    select: { Name: true },
  });

  const result = [...new Set(codes.map((item) => item.Name))];

  res.status(200).json(result);
});
