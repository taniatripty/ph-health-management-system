import status from "http-status";
import AppError from "../../errorhelper/AppError";
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


const getMyAppointments = catchAsync(async (req, res) => {
    const user = req.user;
    const appointments = await appointmentServices.getMyAppointments(user);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'Appointments retrieved successfully',
        data: appointments
    });
});

const getMySingleAppointments = catchAsync(async (req, res) => {
    const user = req.user;
    const {appointmentId}=req.params
    const appointments = await appointmentServices.getMySingleAppointment(appointmentId as string,user);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'Appointments retrieved successfully',
        data: appointments
    });
});
const getAllAppointments = catchAsync(async (req, res) => {
    
    const appointments = await appointmentServices.getAllAppointments();
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'Appointments retrieved successfully',
        data: appointments
    });
});

const bookappointmentwithpaylatter = catchAsync(async (req , res) => {
  const payload = req.body;
  const user = req.user;

  if (!payload?.doctorId || !payload?.scheduleId) {
    throw new AppError(status.BAD_REQUEST, "Doctor ID and schedule ID are required");
  }

  const result = await appointmentServices.bookAppointmentWithPayLater(payload, user);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Book appointment with pay later successfully",
    data: result,
  });
});

const initiatePayment = catchAsync(async (req , res) => {
  const appointmentId = req.params.id;
  const user = req.user;

  if (!appointmentId) {
    throw new AppError(status.BAD_REQUEST, "Appointment ID is required");
  }

  const result = await appointmentServices.initiatePayment(appointmentId as string, user);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Initiate payment successfully",
    data: result,
  });
});
export const appointmentController={
createbookappointment,
getAllAppointments,
getMySingleAppointments,
getMyAppointments,
bookappointmentwithpaylatter,
initiatePayment
}