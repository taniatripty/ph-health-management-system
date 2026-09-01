import { Router } from "express";

import { doctorScheduleContorller } from "./doctorSchedule.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();
router.post("/create",checkAuth(Role.DOCTOR), doctorScheduleContorller.createDoctorSchedule)

export const doctorScheduleRoutes=router