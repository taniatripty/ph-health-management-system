import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get(
  "/", DoctorController.getAllDoctors,
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.getDoctorById,
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.updateDoctor,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.deletedDoctor,
);
export const DoctorRoutes = router;
