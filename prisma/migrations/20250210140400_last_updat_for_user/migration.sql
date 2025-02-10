/*
  Warnings:

  - You are about to drop the column `DeletedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "DeletedAt",
ADD COLUMN     "IsBan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3);
