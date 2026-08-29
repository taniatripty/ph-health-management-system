import { z } from "zod";

const createScheduleZodSchema = z.object({
  startDateTime: z.string().refine((dateTime) => !isNaN(Date.parse(dateTime)), {
    message: "Invalid start date and time format",
  }),

  endDateTime: z.string().refine((dateTime) => !isNaN(Date.parse(dateTime)), {
    message: "Invalid end date and time format",
  }),
});

export { createScheduleZodSchema };