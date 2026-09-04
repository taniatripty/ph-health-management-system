import { Router } from "express";
import { statsController } from "./stats.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();
router.get("/",checkAuth(Role.SUPER_ADMIN,Role.ADMIN,Role.DOCTOR,Role.PATIENT),statsController.getDashboardStatsData)

export const statsRouts=router;