import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const updateDoctorZodSchema = z
  .object({
    doctor: z
      .object({
        name: z.string().min(1).max(100).optional(),
        profilePhoto: z.url().optional(),
        contactNumber: z.string().min(1).max(20).optional(),
        address: z.string().min(1).max(200).optional(),
        experience: z.int().nonnegative().optional(),
        registrationNumber: z.string().min(1).optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
        appointmentFee: z.number().nonnegative().optional(),
        qualification: z.string().min(2).max(50).optional(),
        currentWorkingPlace: z.string().min(2).max(50).optional(),
        designation: z.string().min(2).max(50).optional(),
      })
      .strict()
      .optional(),
    specialties: z
      .array(
        z
          .object({
            specialtyId: z.uuid(),
            shouldDelete: z.boolean().optional(),
          })
          .strict(),
      )
      .refine(
        (specialties) =>
          new Set(specialties.map(({ specialtyId }) => specialtyId)).size ===
          specialties.length,
        "A specialty can only be updated once per request",
      )
      .optional(),
  })
  .strict();
