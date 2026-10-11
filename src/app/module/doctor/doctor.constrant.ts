import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields = ['name', 'email', 'qualification', 'designation', 'currentWorkingPlace', 'registrationNumber', 'specialties.speciatily.title'];

export const doctorFilterableFields = ['gender', 'isDeleted', 'appointmentFee', 'experience', 'registrationNumber', 'specialties.specialtyId', 'currentWorkingPlace', 'designation', 'qualification', 'specialties.speciatily.title', 'user.role'];

export const doctorPartialMatchFields = ['qualification'];
export const doctorNormalizeReversedRangeFields = ['appointmentFee'];

export const doctorIncludeConfig : Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> ={
    user: true,
    specialties: {
        include:{
            
            speciatily:true
        },
    },
    appointment: {
        include: {
            patient: true,
            doctor: true,

        }
    },
    doctorSchedule: {
        include: {
            schedule: true
        }
    },
    prescription: true,
    reviews: true,
}