-- CreateTable
CREATE TABLE "medicalReport" (
    "id" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "medicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicalReport_patientId_idx" ON "medicalReport"("patientId");

-- AddForeignKey
ALTER TABLE "medicalReport" ADD CONSTRAINT "medicalReport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
