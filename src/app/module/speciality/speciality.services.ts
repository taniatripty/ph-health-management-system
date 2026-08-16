import { prisma } from "../../lib/prisma"


const createSpeciality = async (title: string) => {
  const result = await prisma.speciality.create({
    data: {
      title,
    },
  });

  return result;
};

export const specialityService = {
  createSpeciality,
  
};