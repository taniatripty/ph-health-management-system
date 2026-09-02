import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { IUpdatePatientHealthDataPayload, IUpdatePatientProfilePayload } from "./patient.interface";
import { convertToDateTime } from "./patient.utils";

const updateProfile=async(user:IRequest,payload:IUpdatePatientProfilePayload)=>{
    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            id:user.userId
        },
        include:{
          patientHealthData:true,
          medicalReports:true  
        }
    })

    await prisma.$transaction(async(tx)=>{
        if(payload.patientInfo){
             await tx.patient.update({
           where:{
            id:patientData.id
           },
           data:{
            ...payload.patientInfo
           }
        })

        if(payload.patientInfo.name || payload.patientInfo.profilePhoto){
            const userData={
                name:payload.patientInfo.name?payload.patientInfo.address:patientData.name,
                image:payload.patientInfo.profilePhoto?payload.patientInfo.profilePhoto:patientData.profilePhoto
            }
            await tx.user.update({
                where:{
                    id:patientData.userId
                },
                data:{
                    ...userData
                }
            })
        }
        }

       
   
    if(payload.patientHealthData){
        const healthDataToSave:IUpdatePatientHealthDataPayload={
            ...payload.patientHealthData
        }
         if (payload.patientHealthData.dateOfBirth) {
                healthDataToSave.dateOfBirth = convertToDateTime(
                    typeof healthDataToSave.dateOfBirth === "string" ? healthDataToSave.dateOfBirth : undefined
                ) as Date;
            }
            await tx.patientHealthData.upsert({
                where:{
                    patientId:patientData.id
                },
                update:healthDataToSave,
                create:{
                    patientId: patientData.id,
                    ...healthDataToSave
                }
            })

    }
    if(payload.medicalReports && Array.isArray(payload.medicalReports) &&payload.medicalReports.length>0){
        for(const reports of payload.medicalReports){
            if(reports.shouldDelete && reports.reportId){
                await tx.medicalReport.delete({
                    where:{
                        id:reports.reportId
                    }
                })
            }else if(reports.reportName && reports.reportLink){
                await tx.medicalReport.create({
                    data:{
                        patientId:patientData.id,
                        reportName:reports.reportName,
                        reportLink:reports.reportLink
                    }
                })
            }
        }
    }


     })
      const result = await prisma.patient.findUnique({
        where: {
            id: patientData.id
        },
        include: {
            user: true,
            patientHealthData: true,
            medicalReports: true,
        }
    });

    return result;


}

export const patientServices={
    updateProfile
}