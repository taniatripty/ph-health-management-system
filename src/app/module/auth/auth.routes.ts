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
router.post("/forget-password",authController.forgetpassword)
router.post("/reset-password",authController.resetpassword)
router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleloginSuccess);
router.get("/google/success", authController.handleOAuthError);
export const authRoute = router;