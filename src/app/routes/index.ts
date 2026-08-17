import { Router } from "express";


import { authRoute } from "../module/auth/auth.routes";
import { specialityRoute } from "../module/speciality/speciality.routes";




const router = Router();

router.use("/specialities",specialityRoute);
router.use("/auth",authRoute)

export const IndexsRoute = router;