import { Router } from "express";
import { specialityController } from "./speciality.controller";

import { validateRequest } from "../../middleware/validationRequest";
import { createSpecialtyZodSchema } from "./specialty.validation";
import { multerUpload } from "../../config/multer.config";



const router = Router();

router.post(
  "/",
  multerUpload.single("file"),
  validateRequest(createSpecialtyZodSchema),
  specialityController.createSpeciality
);


export const specialityRoute = router;