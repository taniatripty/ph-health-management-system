import { Router } from "express";


import { authRoute } from "../module/auth/auth.routes";
import { specialityRoute } from "../module/speciality/speciality.routes";
import { userRoutes } from "../module/user/user.routes";




const router = Router();

router.use("/specialities",specialityRoute);
router.use("/auth",authRoute);
router.use("/doctor",userRoutes)

export const IndexsRoute = router;