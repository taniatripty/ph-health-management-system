import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { reviewController } from "./reviews.controller";

const router = Router();
router.post("/give", checkAuth(Role.PATIENT), reviewController.giveReviews);
router.get("/", reviewController.getAllReviews);
router.get(
  "/my",
  checkAuth(Role.PATIENT, Role.DOCTOR),
  reviewController.getAllReviews,
);
router.patch("/:id", checkAuth(Role.PATIENT), reviewController.updateReviews);

router.delete("/:id", checkAuth(Role.PATIENT), reviewController.deleteReviews);
export const reviewsRoutes = router;
