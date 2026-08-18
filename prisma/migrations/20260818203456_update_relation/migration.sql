/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,specialtyId]` on the table `doctorspecialty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "doctorspecialty_doctorId_key";

-- DropIndex
DROP INDEX "doctorspecialty_specialtyId_key";

-- CreateIndex
CREATE UNIQUE INDEX "doctorspecialty_doctorId_specialtyId_key" ON "doctorspecialty"("doctorId", "specialtyId");
