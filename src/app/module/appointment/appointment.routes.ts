import { Router } from "express";
import { appointmentController } from "./appointment.controller";



const router=Router();
router.post("/create",appointmentController.createbookappointment)
router.post("/bookwithpaylatter",appointmentController.bookappointmentwithpaylatter)
router.post("/initiatePayment",appointmentController.initiatePayment)
export const appointmentRoutes=router