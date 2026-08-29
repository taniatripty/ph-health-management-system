import { addHours, addMinutes, format } from "date-fns";
import { IcreateSchedule } from "./schedule.interface";
import {convertionDateTime} from "./schedule.utils"
import { prisma } from "../../lib/prisma";

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



export const scheduleServices={
    createSchedule
}