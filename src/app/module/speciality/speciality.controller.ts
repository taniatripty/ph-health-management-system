
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { specialityService } from "./speciality.services";

const createSpeciality = catchAsync(async (req , res) => {
  const result = await specialityService.createSpeciality(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Speciality created successfully",
    data: result,
  });
});




export const specialityController = {
  createSpeciality,
 
};