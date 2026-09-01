import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        where:{
      isDeleted:false
        },
        include: {
            user: true,
            specialties: {
                include: {
                    speciatily:true
                }
            },
         appointment:{
            include:{
                patient:true,
                payment:true
            }
         },
         doctorSchedule:{
            include:{
                schedule:true
            }
         }
           
        }
    })
    return doctors;
}

export const DoctorService = {
    getAllDoctors,
}