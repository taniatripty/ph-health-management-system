import { Request, Response } from "express";
import { specialityService } from "./speciality.services";


const createSpeciality = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    const result = await specialityService.createSpeciality(title);

    res.status(201).json({
      success: true,
      message: "Speciality created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create speciality error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create speciality",
    });
  }
};


export const specialityController = {
  createSpeciality,
 
};