import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();
router.patch("/updateStatus",checkAuth(Role.SUPER_ADMIN,Role.ADMIN), adminController.changeUserStatus)
router.patch("/updateRole",checkAuth(Role.SUPER_ADMIN,Role.ADMIN), adminController.changeUserRole)

export const adminRoutes=router;