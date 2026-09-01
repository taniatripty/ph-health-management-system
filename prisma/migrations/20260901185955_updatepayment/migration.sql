-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
