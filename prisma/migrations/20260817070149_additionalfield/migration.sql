-- CreateEnum
CREATE TYPE "ROle" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "ROle" NOT NULL DEFAULT 'PATIENT',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
