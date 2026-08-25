import z from "zod";

 export const createSpecialtyZodSchema = z.object({
    title : z.string("Title is required"),
   descriptipm : z.string("Description is required").optional(),
})

