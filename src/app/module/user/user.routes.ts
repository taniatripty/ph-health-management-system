import { Router } from "express";
import { UserController } from "./user.controller";

const router=Router();
router.post("/createdoctors", UserController.createDoctor)

export const userRoutes=router