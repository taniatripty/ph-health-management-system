import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./reviews.controller";

const router=Router()
router.post("/give",checkAuth(Role.PATIENT),reviewController.giveReviews)
router.get("/",reviewController.getAllReviews)
router.get("/my", checkAuth(Role.PATIENT,Role.DOCTOR),reviewController.getAllReviews)
router.delete("/:id",checkAuth(Role.PATIENT),reviewController.getAllReviews)
export const reviewsRoutes=router