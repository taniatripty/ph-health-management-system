import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    speciatily:true
                }
            }
        }
    })
    return doctors;
}

export const DoctorService = {
    getAllDoctors,
}