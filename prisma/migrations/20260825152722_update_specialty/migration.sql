/*
  Warnings:

  - You are about to drop the column `descriptipm` on the `specialities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "specialities" DROP COLUMN "descriptipm",
ADD COLUMN     "description" VARCHAR(200);
