import { Request, Response } from "express";
import status from "http-status";
;
import sendResponse from "../../shared/sendResponse";

import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./doctor.services";

const getAllDoctors = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DoctorService.getAllDoctors();

    sendResponse({
      res,
      statusCode: status.OK,
      success: true,
      message: "Doctors retrieved successfully",
      data: result,
    });
  }
);

const getDoctorById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const doctor = await DoctorService.getDoctorById(id as string);

        sendResponse({res, 
            statusCode: status.OK,
            success: true,
            message: "Doctor fetched successfully",
            data: doctor,
        })
    }
)

const updateDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedDoctor = await DoctorService.updateDoctor(id as string, payload);

        sendResponse({res, 
            statusCode: status.OK,
            success: true,
            message: "Doctor updated successfully",
            data: updatedDoctor,
        })
    }
)

export const DoctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor
};