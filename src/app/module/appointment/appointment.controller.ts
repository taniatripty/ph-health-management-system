import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentServices } from "./appointment.services";

const createbookappointment = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await appointmentServices.bookAppointment(user,payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "book appointment successfully",
    data: result,
  });
});

const bookappointmentwithpaylatter = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await appointmentServices.bookAppointmentWithPayLater(payload,user);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: " Book appointment with paylater successfully",
    data: result,
  });
});

const initiatePayment = catchAsync(async (req , res) => {
  const appointmentId=req.params.id
 const user=req.user

  
  const result = await appointmentServices.initiatePayment(appointmentId as string,user);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: " initiate payment successfully",
    data: result,
  });
});
export const appointmentController={
createbookappointment,
bookappointmentwithpaylatter,
initiatePayment
}