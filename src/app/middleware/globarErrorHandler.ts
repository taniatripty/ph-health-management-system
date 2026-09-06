

// /* eslint-disable @typescript-eslint/no-unused-vars */


// import { NextFunction, Request, Response } from "express";
// import status from "http-status";
// import { envVars } from "../config/env";
// import { ZodError } from "zod";
// import { deleteFileFromCloudinary } from "../config/cloudinary.config";
// import { deleteUploadedFilesFromGlobalErrorHandler } from "../utlis/deleteUploadFileFromGlobalError";

// interface TErrorSources {
//   path: string;
//   message: string;
// }

// export const globalErrorHandler = async(
//   err: unknown,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (envVars.NODE_ENV === "development") {
//     console.log("Error from global error handler:", err);
//   }

//     //  if(req.file){
//     //     await deleteFileFromCloudinary(req.file.path)
//     // }

//     // if(req.files && Array.isArray(req.files) && req.files.length > 0){
//     //     const imageUrls = req.files.map((file) => file.path);
//     //     await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url))); 
//     // }
    
//   await deleteUploadedFilesFromGlobalErrorHandler(req)
//   const errorSource: TErrorSources[] = [];

//   let statusCode: number = status.INTERNAL_SERVER_ERROR;
//   let message: string = "Internal server error";
//   let errorMessage: string = "Something went wrong";

//   // Zod validation error
//   if (err instanceof ZodError) {
//     statusCode = status.BAD_REQUEST;
//     message = "Validation error";

//     err.issues.forEach((issue) => {
//       errorSource.push({
//         path: issue.path.join("=>") || "unknown",
//         message: issue.message,
//       });
//     });

//     errorMessage = "Invalid request data";
//   }

//   // Normal Error
//   else if (err instanceof Error) {
//     errorMessage = err.message;
//     message = err.message;
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     error: errorMessage,
//     errorSource,
//   });
// };
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import z from "zod";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";
import { envVars } from "../config/env";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import { handleZodError } from "../errorhelper/handleZodError";
import { deleteUploadedFilesFromGlobalErrorHandler } from "../utlis/deleteUploadFileFromGlobalError";
import AppError from "../errorhelper/AppError";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        console.log("Error from Global Error Handler", err);
    }

    // if(req.file){
    //     await deleteFileFromCloudinary(req.file.path)
    // }

    // if(req.files && Array.isArray(req.files) && req.files.length > 0){
    //     const imageUrls = req.files.map((file) => file.path);
    //     await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url))); 
    // }

    await deleteUploadedFilesFromGlobalErrorHandler(req)

    let errorSources: TErrorSources[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';
    let stack: string | undefined = undefined;

    //Zod Error Patttern
    /*
     error.issues; 
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' , 'password' ], => username password
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] 
    */

    if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack;

    }  else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ]
    }
    else if (err instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = err.message;
         stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ]
       
    }


    const errorResponse: TErrorResponse = {
        success: false,
        message: message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? err : undefined,
        stack: envVars.NODE_ENV === 'development' ? stack : undefined,
    }

    res.status(statusCode).json(errorResponse);
}