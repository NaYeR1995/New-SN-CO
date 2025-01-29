import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

//helper ro read the login user Id

export const createCode = asyncHandler(async (req, res) => {
  const { title, Code, Language, Description, Category } = req.body;
  const { id } = req.user;
  // Find or create the category
  let category = await prisma.category.findUnique({
    where: { name: categoryName },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: categoryName },
    });
  }

  const newCode = await prisma.snippet_code.create({
    data: {
      title,
      Code,
      Language,
      Description,
      user: { connect: { id: id } },
      Category: { connect: { id: category.id } },
    },
  });

  res.status(200).json(newCode);
});
