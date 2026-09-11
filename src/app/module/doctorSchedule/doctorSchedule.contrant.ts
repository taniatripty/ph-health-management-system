import { Prisma } from "../../../generated/prisma/client"


export const doctorScheduleSearchableFields = [
    'id',
    'doctorId',
    'scheduleId',
]

export const doctorScheduleFilterableFields = [
    'id',
    'doctorId',
    'scheduleId',
    'createdAt',
    'updatedAt',
    'isBooked',
    'schedule.startDateTime',
    'schedule.endDateTime',
]

export const doctorScheduleIncludeConfig : Partial<Record<keyof Prisma.DoctorScheduleInclude, Prisma.DoctorScheduleInclude[keyof Prisma.DoctorScheduleInclude]>> ={
    doctor: {
        include: {
            user: true,
            appointment: true,
            specialties: true,
        }
    },
    schedule: true

}