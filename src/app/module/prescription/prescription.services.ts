import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { ICreatePrescriptionPayload } from "./prescription.interface";

const givePrescription=async(user:IRequest, payload:ICreatePrescriptionPayload)=>{
    const doctorData=await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })

    const appointmentData=await prisma.appointment.findFirstOrThrow({
        where:{
            id:payload.appointmentId
        }
    })
    if(appointmentData.doctorId ! ===doctorData.id){
        throw new Error("you can give prescription only for your appointment")

    }
    const isalreadyPrescriped=await prisma.prescription.findFirst({
        where:{
            appointmentId:payload.appointmentId
        }
    })
    if(isalreadyPrescriped){
 throw new Error("Already give prescription")
    }
   const followDate = new Date(payload.followDate)
    const result=await prisma.prescription.create({
            data:{
                ...payload,
                followDate,
                instruction:payload.instructions,
                doctorId:appointmentData.doctorId,
                patientId:appointmentData.patientId
            }

    })
    return result 

}

export const prescriptionServices={
    givePrescription
}