import { Router } from "express";

import { doctorScheduleContorller } from "./doctorSchedule.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();
router.post("/create",checkAuth(Role.DOCTOR), doctorScheduleContorller.createDoctorSchedule)
router.get("/",checkAuth(Role.DOCTOR,Role.PATIENT,Role.SUPER_ADMIN,Role.ADMIN), doctorScheduleContorller.getAllDoctorSchedules)
router.delete("/:id",checkAuth(Role.DOCTOR), doctorScheduleContorller.deleteDoctorSchedule)
router.get("/:doctorId/schedule/:scheduleId", checkAuth(Role.ADMIN,Role.DOCTOR, Role.SUPER_ADMIN),doctorScheduleContorller.getDoctorScheduleById);

export const doctorScheduleRoutes=router