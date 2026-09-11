import { DoctorSchedule, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interface/query.interface";
import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utlis/queryBuilder";
import { doctorScheduleFilterableFields, doctorScheduleIncludeConfig, doctorScheduleSearchableFields } from "./doctorSchedule.contrant";
import { ICreateDoctorSchedulePayload } from "./doctorSchedule.interface";

const createmySchedule=async(user:IRequest,payload:ICreateDoctorSchedulePayload)=>{

    const doctorData= await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })
console.log(doctorData)
    const doctorScheduluData=payload.scheduleIds.map((scheduleId)=>({
         doctorId:doctorData?.id,
        scheduleId
    }))
    await prisma.doctorSchedule.createMany({
        data:doctorScheduluData
    })
    const result=await prisma.doctorSchedule.findMany({
        where:{
            doctorId:doctorData?.id,
            scheduleId:{
                in:payload.scheduleIds
            }
        },
        include:{
            schedule:true
        }
    })
    return result

}



const getAllDoctorSchedules=async(query:IQueryParams)=>{
    const queryBuilder=new QueryBuilder<DoctorSchedule,Prisma.DoctorScheduleWhereInput,Prisma.DoctorScheduleInclude>(prisma.doctorSchedule,query,{
         filterableFields: doctorScheduleFilterableFields,
        searchableFields: doctorScheduleSearchableFields
    })
     const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(doctorScheduleIncludeConfig)
    .sort()
    .execute();

    return result;

}

const deletedMyDoctorSchedule = async (
  id: string,
  user: IRequest
) => {
 

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  await prisma.doctorSchedule.deleteMany({
    where: {
      isBooked: false,
      doctorId: doctorData.id,
      scheduleId: id,
    },
  });
};

export const doctorScheduleServices={
    createmySchedule,
    getAllDoctorSchedules,
    deletedMyDoctorSchedule
}