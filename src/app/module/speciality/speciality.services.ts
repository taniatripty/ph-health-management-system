import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"


const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
  const result = await prisma.speciality.create({
    
    data:payload
  });

  return result;
};

const getAllSpecialties = async (): Promise<Speciality[]> => {

    const specialties = await prisma.speciality.findMany();
    return specialties;
}

const deleteSpecialty = async (id: string): Promise<Speciality> => {

    const specialty = await prisma.speciality.delete({
        where: { id }
    })

    return specialty;
}


export const specialityService = {
  createSpeciality,
  getAllSpecialties,
  deleteSpecialty
  
};