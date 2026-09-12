import { Router } from "express";
import { prescriptionController } from "./prescription.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();
router.post("/give",checkAuth(Role.DOCTOR), prescriptionController.givePrescription)
router.get("/",prescriptionController.getAllPrescription)
router.delete("/:id",checkAuth(Role.DOCTOR),prescriptionController.deletePrescription)
export const prescriptionRoutes=router