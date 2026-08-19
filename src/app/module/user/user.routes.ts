import { Router } from "express";
import { UserController } from "./user.controller";

import { createDoctorZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validationRequest";

const router=Router();
router.post("/createdoctors",validateRequest(createDoctorZodSchema),UserController.createDoctor)

export const userRoutes=router