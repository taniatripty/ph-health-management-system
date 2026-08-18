import { Role, Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";
import { auth } from "../../lib/auth";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialities: Speciality[] = [];

  // Check all specialties
  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.speciality.findUnique({
      where: {
        id: specialtyId,
      },
    });

    if (!specialty) {
      throw new Error(
        `Specialty with id ${specialtyId} not found`
      );
    }

    specialities.push(specialty);
  }

  // Check existing user
  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (userExist) {
    throw new Error("User already exists");
  }

  // Create Better Auth user
  const userdata = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });

  if (!userdata.user) {
    throw new Error("Failed to create user");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create doctor
      const doctorData = await tx.doctor.create({
        data: {
          userId: userdata.user.id,
          ...payload.doctor,
        },
      });

      // Create doctor-specialty relations
      const doctorSpecialtyData = specialities.map((specialty) => ({
        doctorId: doctorData.id,
        specialtyId: specialty.id,
      }));

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });

      // Return doctor with relations
      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
         profilePhoto:true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          averageRating: true,
          createdAt: true,
          updatedAt: true,

          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },

          specialties: {
            select: {
              speciatily: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });

    return result;
  } catch (err) {
    console.log("Transaction error:", err);

    // Remove Better Auth user if Prisma transaction fails
    await prisma.user.delete({
      where: {
        id: userdata.user.id,
      },
    });

    throw err;
  }
};

export const userServices = {
  createDoctor,
};