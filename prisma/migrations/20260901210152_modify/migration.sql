/*
  Warnings:

  - You are about to drop the column `paymentGateWayData` on the `payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "paymentGateWayData",
ADD COLUMN     "paymentGatewayData" JSONB;
