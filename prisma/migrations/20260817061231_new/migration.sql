/*
  Warnings:

  - You are about to drop the column `decriptipm` on the `specialities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "specialities" DROP COLUMN "decriptipm",
ADD COLUMN     "descriptipm" VARCHAR(200);
