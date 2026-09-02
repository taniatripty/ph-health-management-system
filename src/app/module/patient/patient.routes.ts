import { Router } from "express";
import { patientController } from "./patient.controller";

const router=Router()
router.post("/update", patientController.updateProfile)
export const patientRoutes=router