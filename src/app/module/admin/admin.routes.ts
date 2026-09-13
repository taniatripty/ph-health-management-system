import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { adminController } from "./admin.controller";
import { updateAdminZodSchema } from "./admin.validation";

const router = Router();
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.getAllAdmin,
);
router.patch(
  "/updateStatus",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.changeUserStatus,
);
router.patch(
  "/updateRole",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.changeUserRole,
);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(updateAdminZodSchema),
  adminController.updateAdmin,
);
router.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.getAdminById,
);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), adminController.deleteAdmin);

export const adminRoutes = router;
