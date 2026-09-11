
import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";
import {v7 as uuidv7} from "uuid"
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorhelper/AppError";
import status from "http-status";

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

    const transactionId=String(uuidv7())
    const paymentData=await tx.payment.create({
        data:{
            appointmentId:appointmentData.id,
            amount:doctorData.appointmentFee,
            transactionId
        }
    })
    const session=await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
            mode: 'payment',
            line_items :[
                {
                    price_data:{
                        currency:"bdt",
                        product_data:{
                            name : `Appointment with Dr. ${doctorData.name}`,
                        },
                        unit_amount : doctorData.appointmentFee * 100,
                    },
                    quantity : 1,
                }
            ],
            metadata:{
                appointmentId : appointmentData.id,
                paymentId : paymentData.id,
            },

            // success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,
             success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success?session_id={CHECKOUT_SESSION_ID}`,

            // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
            cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`,
     })
     console.log("sesion", session)
    return {
         appointmentData,
            paymentData,
            paymentUrl : session.url,
    }
  })
  return {
     appointment : result.appointmentData,
        payment : result.paymentData,
        paymentUrl : result.paymentUrl,
  }
}

const getMyAppointments = async (user: IRequest) => {
  // User can be patient or doctor, so check both

  const patientData = await prisma.patient.findUnique({
    where: {
      email: user.email,
    },
  });

  if (patientData) {
    return await prisma.appointment.findMany({
      where: {
        patientId: patientData.id,
      },
      include: {
        doctor: true,
        schedule: true,
      },
    });
  }

  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user.email,
    },
  });

  if (doctorData) {
    return await prisma.appointment.findMany({
      where: {
        doctorId: doctorData.id,
      },
      include: {
        patient: true,
        schedule: true,
      },
    });
  }

  throw new Error("User not found");
};

const getAllAppointments = async () => {
    const appointments = await prisma.appointment.findMany({
        include: {
            doctor:true,
            patient:true,
            schedule:true
        }
    });
    return appointments;
}

const getMySingleAppointment = async (appointmentId: string, user: IRequest) => {

    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointment;

    if (patientData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    } else if (doctorData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    }

    if (!appointment) {
        throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    return appointment;
}

const bookAppointmentWithPayLater = async (payload : IBookAppointmentPayload, user : IRequest) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        }
    });

    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId,
        }
    });

    const doctorSchedule = await prisma.doctorSchedule.findUniqueOrThrow({
        where: {
            scheduleId_doctorId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id,
            }
        }
    });

    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorSchedule.scheduleId,
                videoCallingId,
            }
        });

        await tx.doctorSchedule.update({
            where: {
                scheduleId_doctorId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId,
                }
            },
            data: {
                isBooked: true,
            }
        });

        const transactionId = String(uuidv7());

        const paymentData = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
             }
        });

        return {
            appointment: appointmentData,
            payment: paymentData
        };

    });

    return result;
}  


const initiatePayment = async (appointmentId: string, user : IRequest) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            patientId: patientData.id,
        },
        include: {
            doctor: true,
            payment : true,
        }
    });

    if(!appointmentData){
        throw new AppError( status.NOT_FOUND,"Appointment not found");
    }

    if(!appointmentData.payment){
        throw new AppError( status.NOT_FOUND, "Payment data not found for this appointment");
    }

    if(appointmentData.paymentStatus === PaymentStatus.PAID){
        throw new AppError( status.BAD_REQUEST, "Payment already completed for this appointment");
    };

    if(appointmentData.status === AppointmentStatus.CANCELED){
        throw new AppError( status.BAD_REQUEST ,"Appointment is canceled");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `Appointment with Dr. ${appointmentData.doctor.name}`,
                    },
                    unit_amount: appointmentData.doctor.appointmentFee * 100,
                },
                quantity: 1,
            }
        ],
        metadata: {
            appointmentId: appointmentData.id,
            paymentId: appointmentData.payment.id,
        },

        success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success?appointment_id=${appointmentData.id}&payment_id=${appointmentData.payment.id}`,

      
        // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
        cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments?error=payment_cancelled`,
    })
    
    console.log("-----session-----",session.url)

    return {
        
        paymentUrl:session.url,
    }
}

const cancelUnpaidAppointments = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const unpaidAppointments = await prisma.appointment.findMany({
        where: {
            // status: AppointmentStatus.SCHEDULED,
            createdAt: {
                lte:thirtyMinutesAgo
            },
            paymentStatus: PaymentStatus.UNPAID,
        },
    });

    const appointmentToCancel = unpaidAppointments.map(appointment => appointment.id);

    await prisma.$transaction(async (tx) => {

        await tx.appointment.updateMany({
            where: {
                id: {
                    in: appointmentToCancel,
                },
            },
            data: {
                status: AppointmentStatus.CANCELED,
            },
        });

        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentToCancel,
                },
            },
        });

        for(const unpaidAppointment of unpaidAppointments){
            await tx.doctorSchedule.update({
                where: {
                    scheduleId_doctorId: {
                        doctorId: unpaidAppointment.doctorId,
                        scheduleId: unpaidAppointment.scheduleId,
                    },
                },
                data: {
                    isBooked: false,
                },
            });
        }
    });
}




export const appointmentServices={
    bookAppointment,
    getMyAppointments,
    getAllAppointments,
    getMySingleAppointment,
    bookAppointmentWithPayLater,
    initiatePayment,
    cancelUnpaidAppointments

}