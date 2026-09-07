import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.get("/", checkAuth(Role.DOCTOR,Role.PATIENT,Role.ADMIN,Role.SUPER_ADMIN), DoctorController.getAllDoctors)
router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.getDoctorById);
router.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.updateDoctor);
export const DoctorRoutes = router;