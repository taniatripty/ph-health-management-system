

import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { scheduleServices } from "./schedule.services";
import { IQueryParams } from "../../interface/query.interface";


const createSchedule = catchAsync(async (req , res) => {
  const payload=req.body


 
  const result = await scheduleServices.createSchedule(payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});


const getAllSchedules = catchAsync(async (req, res) => {
    const query = req.query;
    const result  = await scheduleServices.getAllSchedule(query as IQueryParams);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'All  schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getScheduleById = catchAsync(async (req, res) => {
    const {id}=req.params
    const result  = await scheduleServices.getScheduleById(id as string);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result
       
    });
});

const updateSchedule  = catchAsync(async (req, res) => {
    const {id}=req.params
    const payload=req.body
    const result  = await scheduleServices.updateSchedule(id as string,payload);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result
       
    });
});

const deleteSchedule = catchAsync(async (req, res) => {
    const {id}=req.params
    await scheduleServices.deleteSchedule(id as string);
    sendResponse({res, 
        success: true,
        statusCode: status.OK,
        message: 'Schedule delete successfully',
        
       
    });
});




export const scheduleController={
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}
