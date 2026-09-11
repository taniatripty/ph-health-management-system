import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";



const router=Router();
router.post("/create",checkAuth(Role.PATIENT),appointmentController.createbookappointment)
router.get("/",checkAuth(Role.PATIENT),appointmentController.getMyAppointments)
router.get("/all",checkAuth(Role.PATIENT,Role.DOCTOR,Role.ADMIN,Role.SUPER_ADMIN),appointmentController.getAllAppointments)
router.get("/:id",checkAuth(Role.PATIENT,Role.DOCTOR),appointmentController.getMySingleAppointments)
router.post("/bookwithpaylatter",appointmentController.bookappointmentwithpaylatter)
router.post("/initiatePayment/:id",appointmentController.initiatePayment)
export const appointmentRoutes=router