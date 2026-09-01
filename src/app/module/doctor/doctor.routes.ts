import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.get("/", checkAuth(Role.DOCTOR,Role.PATIENT,Role.ADMIN,Role.SUPER_ADMIN), DoctorController.getAllDoctors)

export const DoctorRoutes = router;