import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { patientController } from "./patient.controller";
import { PatientValidation } from "./patient.validation";
import { updateProfileMiddleware } from "./patient.middleware";

const router = Router();
router.patch(
  "/updateProfile",
  checkAuth(Role.PATIENT),
  multerUpload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "medicalReports", maxCount: 5 },
  ]),updateProfileMiddleware,
  validateRequest(PatientValidation.updatePatientProfileZodSchema),
  patientController.updateProfile,
);
export const patientRoutes = router;
