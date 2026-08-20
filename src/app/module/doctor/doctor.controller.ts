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

export const DoctorController = {
  getAllDoctors,
};