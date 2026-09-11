import status from "http-status";
import { IQueryParams } from "../../interface/query.interface";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorScheduleServices } from "./doctorSchedule.services";

const createDoctorSchedule = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user
  
 console.log(req.user)

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

const getAllDoctorSchedules = catchAsync(async (req, res) => {
    const query = req.query;
    const result  = await doctorScheduleServices.getAllDoctorSchedules(query as IQueryParams);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'All doctor schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});


const getDoctorScheduleById = catchAsync(async (req, res) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const doctorSchedule = await doctorScheduleServices.getDoctorScheduleById(doctorId as string, scheduleId as string);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'Doctor schedule retrieved successfully',
        data: doctorSchedule
    });
});
const deleteDoctorSchedule = catchAsync(async (req, res) => {
    const {id}=req.params
    const user=req.user
  
    await doctorScheduleServices.deletedMyDoctorSchedule(id as string, user);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: ' Delete doctor schedules successfully',
        
       
    });
});

export const doctorScheduleContorller={
createDoctorSchedule,
getAllDoctorSchedules,
getDoctorScheduleById,
deleteDoctorSchedule
}