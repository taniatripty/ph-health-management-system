import { PaymentStatus } from "../../../generated/prisma/enums";
import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./reviews.interface";

const giveReview=async(user:IRequest,payload:ICreateReviewPayload)=>{
    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })
    const appointmentData=await prisma.appointment.findUniqueOrThrow({
        where:{
            id:payload.appointmentId
        }
    })
    if(appointmentData.paymentStatus ! === PaymentStatus.PAID){
        throw new Error ("you can give review after payment is done")
    }
    if(appointmentData.patientId===patientData.id){
        throw new Error ("you can give review only rour own appointment")
    }
    const isReview=await prisma.review.findFirst({
        where:{
            appointmentId:payload.appointmentId
        }
    })
     if (isReview) {
        throw new Error( "You have already reviewed for this appointment. You can update your review instead.");
    };
    const result=await prisma.$transaction(async(tx)=>{
        const review=await tx.review.create({
          data:{
              ...payload,
            patientId:appointmentData.patientId,
            doctorId:appointmentData.doctorId
          }
        })
        const averateRatting=await tx.review.aggregate({
            where:{
                doctorId:appointmentData.doctorId
            },
            _avg:{
                ratting:true
            }
        })
        await tx.doctor.update({
            where:{
                id:appointmentData.doctorId
            },
            data:{
                averageRating:averateRatting._avg.ratting as number
            }
        })
        return review
    })  
    return result 

}
export const reviewServices={
    giveReview
}