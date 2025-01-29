import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

//helper ro read the login user Id

export const createCode = asyncHandler(async (req, res) => {
  const { title, Code, Language, Description, Category } = req.body;
  const { id: userId } = req.user;

  // Find or create the category for this user
  let category = await prisma.category.findFirst({
    where: {
      Name: Category,  // Correct case-sensitive field
      UserId: userId,
    },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        Name: Category,
        User: { connect: { id: userId } }, // Use 'User' instead of 'user'
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
      user: { connect: { id: userId } },
      Category: { connect: { id: category.id } },
    },
  });

  res.status(200).json(newCode);
});
