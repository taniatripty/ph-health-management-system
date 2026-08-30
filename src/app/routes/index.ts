import { Router } from "express";


import { authRoute } from "../module/auth/auth.routes";
import { specialityRoute } from "../module/speciality/speciality.routes";
import { userRoutes } from "../module/user/user.routes";
import { DoctorRoutes } from "../module/doctor/doctor.routes";
import { scheduleRoutes } from "../module/schedule/schedule.routes";
import { doctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.routes";
import { appointmentRoutes } from "../module/appointment/appointment.routes";




const router = Router();

router.use("/specialities",specialityRoute);
router.use("/auth",authRoute);
router.use("/doctor",userRoutes)
router.use("/getdoctor",DoctorRoutes)
router.use("/schedule",scheduleRoutes)
router.use("/doctorSchedule",doctorScheduleRoutes)
router.use("/bookappointment",appointmentRoutes)

export const IndexsRoute = router;