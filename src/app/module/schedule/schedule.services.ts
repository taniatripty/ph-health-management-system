import { addHours, addMinutes, format } from "date-fns";
import { IcreateSchedule, IUpdateSchedulePayload } from "./schedule.interface";
import {convertionDateTime} from "./schedule.utils"
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interface/query.interface";
import { QueryBuilder } from "../../utlis/queryBuilder";
import { Prisma, Schedule } from "../../../generated/prisma/client";
import { scheduleFilterableFields, scheduleIncludeConfig, scheduleSearchableFields } from "./schedule.constrant";

const createSchedule=async(payload:IcreateSchedule)=>{
    const {startDate,endDate,startTime,endTime}=payload
    const currentDate=new Date(startDate)

    const lastDate=new Date(endDate)

    const interval=30;
    const shcedules=[]
    while(currentDate<=lastDate){
        const startDateTime=new Date(
            addMinutes(
              addHours(
                `${format(currentDate ,"yyyy-MM-dd")}`,
                Number(startTime.split(":")[0])
              ),
               Number(startTime.split(":")[1])
            )
        );
        const endDateTime=new Date(
            addMinutes(
              addHours(
                `${format(currentDate ,"yyyy-MM-dd")}`,
                Number(endTime.split(":")[0])
              ),
               Number(endTime.split(":")[1])
            )
        );
        while(startDateTime<endDateTime){
            const s=await convertionDateTime(startDateTime)
            const e=await convertionDateTime(addMinutes(startDateTime,interval))
        
        const scheduluData={
            startDateTime:s,
            endDateTime:e
        }

         const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduluData.startDateTime,
                    endDateTime:scheduluData.endDateTime
                }
            })

            if(!existingSchedule){
                const result= await prisma.schedule.create({
                    data:scheduluData
                })
                console.log(result)
                shcedules.push(result)
            }

        startDateTime.setMinutes(startDateTime.getMinutes()+interval)
    }
    currentDate.setDate(currentDate.getDate()+1)

    }
    return shcedules

}


const getAllSchedule=async(query:IQueryParams)=>{
    const querybuilder=new QueryBuilder<Schedule,Prisma.ScheduleWhereInput,Prisma.ScheduleInclude>(prisma.schedule,query,{
         
            searchableFields: scheduleSearchableFields,
            filterableFields:scheduleFilterableFields
        
    })

    const result=await querybuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(scheduleIncludeConfig)
    .sort()
     .fields()
    .execute();

    return result

}

const getScheduleById = async (id: string) => {
    const schedule = await prisma.schedule.findUnique({
        where: {
            id: id
        }
    });
    return schedule;
}



const updateSchedule = async (id: string, payload: IUpdateSchedulePayload) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const startDateTime = new Date(
        addMinutes(
            addHours(
                `${format(new Date(startDate), 'yyyy-MM-dd')}`,
                Number(startTime.split(':')[0])
            ),
            Number(startTime.split(':')[1])
        )
    );

    const endDateTime = new Date(
        addMinutes(
            addHours(
                `${format(new Date(endDate), 'yyyy-MM-dd')}`,
                Number(endTime.split(':')[0])
            ),
            Number(endTime.split(':')[1])
        )
    );

    const updatedSchedule = await prisma.schedule.update({
        where: {
            id: id
        },
        data: {
            startDateTime: startDateTime,
            endDateTime: endDateTime
        }
    });

    return updatedSchedule;
}



const deleteSchedule = async (id: string) => {
    await prisma.schedule.delete({
        where: {
            id: id
        }
    });
    return true;
}



export const scheduleServices={
    createSchedule,
    getAllSchedule,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}