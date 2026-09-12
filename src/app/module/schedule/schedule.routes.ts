import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router=Router();
router.post("/create", scheduleController.createSchedule)
router.get("/", scheduleController.getAllSchedules)
router.get("/:id", scheduleController.getScheduleById)
router.delete("/:id", scheduleController.deleteSchedule)
router.patch("/:id", scheduleController.updateSchedule)
export const scheduleRoutes=router