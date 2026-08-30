import { Router } from "express";
import { appointmentController } from "./appointment.controller";



const router=Router();
router.post("/create",appointmentController.createbookappointment)

export const appointmentRoutes=router