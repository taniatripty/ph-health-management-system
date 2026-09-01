/*
  Warnings:

  - You are about to drop the column `sprtipeEventId` on the `payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "sprtipeEventId",
ADD COLUMN     "stripeEventId" TEXT;
