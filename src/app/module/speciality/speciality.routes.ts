import { Router } from "express";
import { specialityController } from "./speciality.controller";


const router = Router();

router.post("/", specialityController.createSpeciality);


export const specialityRoute = router;