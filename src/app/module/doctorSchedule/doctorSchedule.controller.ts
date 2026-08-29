import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorScheduleServices } from "./doctorSchedule.services";

const createDoctorSchedule = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await doctorScheduleServices.createmySchedule(user,payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: " Doctor Schedule created successfully",
    data: result,
  });
});

export const doctorScheduleContorller={
createDoctorSchedule
}