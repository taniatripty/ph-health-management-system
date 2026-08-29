

import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { scheduleServices } from "./schedule.services";


const createSchedule = catchAsync(async (req , res) => {
  const payload=req.body


  console.log("paylod :",payload)
  const result = await scheduleServices.createSchedule(payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

export const scheduleController={
    createSchedule
}
