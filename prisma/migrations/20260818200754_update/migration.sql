/*
  Warnings:

  - You are about to drop the column `profilePhote` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "profilePhote",
ADD COLUMN     "profilePhoto" TEXT,
ALTER COLUMN "experience" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
