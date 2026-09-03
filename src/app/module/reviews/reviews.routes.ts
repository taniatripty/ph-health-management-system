import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./reviews.controller";

const router=Router()
router.post("/give",checkAuth(Role.PATIENT),reviewController.giveReviews)
export const reviewsRoutes=router