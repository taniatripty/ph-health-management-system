import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.get("/", checkAuth(Role.DOCTOR), DoctorController.getAllDoctors)

export const DoctorRoutes = router;