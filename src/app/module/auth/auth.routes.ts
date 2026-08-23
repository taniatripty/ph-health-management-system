import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";



const router = Router();

router.post("/register",authController.registerUser);
router.post("/login",authController.loginUser);
router.get("/me",checkAuth(Role.PATIENT,Role.ADMIN,Role.DOCTOR,Role.SUPER_ADMIN), authController.getMe)
router.post("/refresh-token",authController.getnewToken);
router.post("/change-password",checkAuth(Role.PATIENT,Role.ADMIN,Role.DOCTOR,Role.SUPER_ADMIN),authController.changePassword);
router.post("/logout",checkAuth(Role.PATIENT,Role.ADMIN,Role.DOCTOR,Role.SUPER_ADMIN),authController.logoutUser);
router.post("/verify-email",authController.verifyEmail);
export const authRoute = router;