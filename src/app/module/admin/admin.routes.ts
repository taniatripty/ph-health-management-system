import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { adminController } from "./admin.controller";

const router = Router();
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.getAllAdmin,
);
router.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.getAdminById,
);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  adminController.updateAdmin,
);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), adminController.deleteAdmin);
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

export const adminRoutes = router;
