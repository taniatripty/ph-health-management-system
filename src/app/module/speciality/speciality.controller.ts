
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { specialityService } from "./speciality.services";

const createSpeciality = catchAsync(async (req , res) => {
  const payload=
  {...req.body,
    icon:req.file?.path
  }
  console.log( "file" ,req.file)
  console.log(payload)
  const result = await specialityService.createSpeciality(payload);

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