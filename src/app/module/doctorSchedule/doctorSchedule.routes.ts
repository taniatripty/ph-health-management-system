import { Router } from "express";

import { doctorScheduleContorller } from "./doctorSchedule.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();
router.post("/create",checkAuth(Role.DOCTOR), doctorScheduleContorller.createDoctorSchedule)
router.get("/",checkAuth(Role.DOCTOR,Role.PATIENT,Role.SUPER_ADMIN,Role.ADMIN), doctorScheduleContorller.getAllDoctorSchedules)
router.delete("/:id",checkAuth(Role.DOCTOR), doctorScheduleContorller.deleteDoctorSchedule)


export const doctorScheduleRoutes=router