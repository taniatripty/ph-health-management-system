import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validationRequest";
import { updateAdminZodSchema } from "./admin.validation";

const router=Router();
router.get("/",checkAuth(Role.SUPER_ADMIN,Role.ADMIN), adminController.getAllAdmin)
router.get("/:id",checkAuth(Role.SUPER_ADMIN,Role.ADMIN), adminController.getAdminById)
router.patch("/:id",checkAuth(Role.SUPER_ADMIN),validateRequest(updateAdminZodSchema),adminController.updateAdmin)
router.patch("/updateStatus",checkAuth(Role.SUPER_ADMIN,Role.ADMIN), adminController.changeUserStatus)
router.patch("/updateRole",checkAuth(Role.SUPER_ADMIN,Role.ADMIN), adminController.changeUserRole)

export const adminRoutes=router;