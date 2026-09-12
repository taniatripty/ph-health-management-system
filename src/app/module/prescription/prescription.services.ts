/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorhelper/AppError";
import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utlis/email";
import { ICreatePrescriptionPayload } from "./prescription.interface";
import { generatePrescriptionPDF } from "./prescription.utils";



const givePrescription = async (user : IRequest, payload : ICreatePrescriptionPayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        },
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        },
        include: {
            patient: true,
            doctor: {
                include:{
                    specialties: true
                }
            },
            schedule: {
                include:{
                    doctorSchedules: true
                }
            },
        }
    });

    if(appointmentData.doctorId !== doctorData.id){
        throw new AppError(status.BAD_REQUEST, "You can only give prescription for your own appointments");
    }

    const isAlreadyPrescribed = await prisma.prescription.findFirst({
        where: {
            appointmentId : payload.appointmentId
        }
    });

    if (isAlreadyPrescribed) {
        throw new AppError(status.BAD_REQUEST, "You have already given prescription for this appointment. You can update the prescription instead.");
    }

    const followUpDate = new Date(payload.followUpDate);

   

   const result = await prisma.$transaction(async (tx) => {
       const result = await tx.prescription.create({
           data: {
               ...payload,
               followUpDate,
               instruction:payload.instructions,
               doctorId: appointmentData.doctorId,
               patientId: appointmentData.patientId,
           }
       });

       const pdfBuffer = await generatePrescriptionPDF({
           doctorName: doctorData.name,
           patientName: appointmentData.patient.name,
           appointmentDate: appointmentData.schedule.startDateTime,
           instructions: payload.instructions,
           followUpDate,
           doctorEmail: doctorData.email,
           patientEmail: appointmentData.patient.email,
           prescriptionId: result.id,
           createdAt: new Date(),
       });

       const fileName = `Prescription-${Date.now()}.pdf`;
       const uploadedFile = await uploadFileToCloudinary(pdfBuffer, fileName);
       const pdfUrl = uploadedFile.secure_url;

       const updatedPrescription = await tx.prescription.update({
           where: {
               id: result.id
           },
           data: {
               pdfUrl
           }
       });

       try {
        const patient = appointmentData.patient;
        const doctor = appointmentData.doctor;

           await sendEmail({
               to: patient.email,
               subject: `You have received a new prescription from Dr. ${doctor.name}`,
               templateName: "prescription",
               templateData: {
                    doctorName: doctor.name,
                    patientName: patient.name,
                    specialization: doctor.specialties.map((s : any )=> s.title).join(", "),
                    appointmentDate: new Date(appointmentData.schedule.startDateTime).toLocaleString(),
                    issuedDate: new Date().toLocaleDateString(),
                    prescriptionId: result.id,
                    instructions: payload.instructions,
                    followUpDate: followUpDate.toLocaleDateString(),
                    pdfUrl: pdfUrl
               },
               attachments:[
                {
                    filename: fileName,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
               ]
           })
       } catch (error) {
            console.log("Failed To send email notification for prescription", error);
       }

       return updatedPrescription;
   }, {
    maxWait : 15000,
    timeout: 20000,
   });

    return result;
  
};


const getAllPrescriptions = async () => {
    const result = await prisma.prescription.findMany({
        include: {
            patient: true,
            doctor: true,
            appointment: true,
        }
    })

    return result;
};

const deletePrescription = async (user: IRequest, prescriptionId: string): Promise<void> => {
    // Verify user exists
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: user?.email
        }
    });

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Fetch prescription data
    const prescriptionData = await prisma.prescription.findUniqueOrThrow({
        where: {
            id: prescriptionId
        },
        include: {
            doctor: true
        }
    });

    // Verify the user is the doctor for this prescription
    if (!(user?.email === prescriptionData.doctor.email)) {
        throw new AppError(status.BAD_REQUEST, "This is not your prescription!")
    }

    // Delete PDF from Cloudinary if it exists
    if (prescriptionData.pdfurl) {
        try {
            await deleteFileFromCloudinary(prescriptionData.pdfurl);
        } catch (deleteError) {
            // Log but don't fail - still delete from database
            console.error("Failed to delete PDF from Cloudinary:", deleteError);
        }
    }

    // Delete prescription from database
    await prisma.prescription.delete({
        where: {
            id: prescriptionId
        }
    });
}




export const prescriptionServices={
    givePrescription,
    getAllPrescriptions,
    deletePrescription
}