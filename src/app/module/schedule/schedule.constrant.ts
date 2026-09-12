import { Prisma } from "../../../generated/prisma/client"


export const scheduleFilterableFields = [
    'id',
    'startDateTime',
    'endDateTime',
    // 'appointments.doctors.id',
]

export const scheduleSearchableFields = [
    'id',
    'startDateTime',
    'endDateTime',
]

export const scheduleIncludeConfig : Partial<Record<keyof Prisma.ScheduleInclude, Prisma.ScheduleInclude[keyof Prisma.ScheduleInclude]>> ={
    appointment: {
        include: {
            doctor: true,
            patient: true,
            payment: true,
           pescription:true,
            review: true,
        }
    },
    doctorSchedules: true
}