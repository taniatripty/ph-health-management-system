import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";
import {v7 as uuidv7} from "uuid"

const bookAppointment=async(user:IRequest, payload:IBookAppointmentPayload)=>{

 const patientData=await prisma.patient.findUniqueOrThrow({
    where:{
        email:user.email
    }
 })
 const doctorData= await prisma.doctor.findUniqueOrThrow({
   where:{
     id:payload.doctorId,
     isDeleted:false,
   }
 })
 const scheduleData=await prisma.schedule.findUniqueOrThrow({
    where:{
        id:payload.scheduleId
    }
 })
 const doctorSchedule=await prisma.doctorSchedule.findUniqueOrThrow({
    where:{
        scheduleId_doctorId:{
            doctorId:doctorData.id,
            scheduleId:scheduleData.id
        }
    }
 })
  const videoCallingId = String(uuidv7());
  const result=await prisma.$transaction(async(tx)=>{
    const appointmentData=await tx.appointment.create({
        data:{
            doctorId:doctorData.id,
        patientId:patientData.id,
        scheduleId:doctorSchedule.scheduleId,
        videoCallingId,

        }

        
    })

    await tx.doctorSchedule.update({
        where:{
            scheduleId_doctorId:{
                doctorId:payload.doctorId,
                scheduleId:payload.scheduleId

            }
        },
        data:{
            isBooked:true
        }
    })
    return appointmentData
  })
  return result
}

export const appointmentServices={
    bookAppointment
}