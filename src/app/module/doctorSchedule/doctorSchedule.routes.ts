import { Router } from "express";

import { doctorScheduleContorller } from "./doctorSchedule.controller";

const router=Router();
router.post("/create",doctorScheduleContorller.createDoctorSchedule)

export const doctorScheduleRoutes=router