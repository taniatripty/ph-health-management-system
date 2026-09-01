import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";



const router=Router();
router.post("/create",checkAuth(Role.PATIENT),appointmentController.createbookappointment)
router.post("/bookwithpaylatter",appointmentController.bookappointmentwithpaylatter)
router.post("/initiatePayment/:id",appointmentController.initiatePayment)
export const appointmentRoutes=router