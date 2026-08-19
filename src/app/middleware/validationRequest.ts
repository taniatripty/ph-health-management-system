// import { NextFunction, Request, Response } from "express";
// import z from "zod";

// export const validationRequest=(zodSchema:z.ZodObject)=>{
//     return(req:Request,res:Response,next:NextFunction)=>{
//       const parseresult=zodSchema.safeParse(req.body)
//       if(!parseresult.success){
//         next(parseresult.error)
//       }
//       req.body=parseresult.data
//       next() 
//     }

// }

import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedResult = zodSchema.safeParse(req.body)

        if (!parsedResult.success) {
            next(parsedResult.error)
        }

        //sanitizing the data
        req.body = parsedResult.data;

        next();
    }
}