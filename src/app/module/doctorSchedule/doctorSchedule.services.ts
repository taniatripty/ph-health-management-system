import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorSchedulePayload } from "./doctorSchedule.interface";

const createmySchedule=async(user:IRequest,payload:ICreateDoctorSchedulePayload)=>{

    const doctorData= await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })

    const doctorScheduluData=payload.scheduleIds.map((scheduleId)=>({
         doctorId:doctorData?.id,
        scheduleId
    }))
    await prisma.doctorSchedule.createMany({
        data:doctorScheduluData
    })
    const result=await prisma.doctorSchedule.findMany({
        where:{
            doctorId:doctorData?.id,
            scheduleId:{
                in:payload.scheduleIds
            }
        },
        include:{
            schedule:true
        }
    })
    return result

}

export const doctorScheduleServices={
    createmySchedule
}