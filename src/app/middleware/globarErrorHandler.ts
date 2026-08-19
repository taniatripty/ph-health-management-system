/* eslint-disable @typescript-eslint/no-unused-vars */


import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVars } from "../config/env";
import { ZodError } from "zod";

interface TErrorSources {
  path: string;
  message: string;
}

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler:", err);
  }

  const errorSource: TErrorSources[] = [];

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal server error";
  let errorMessage: string = "Something went wrong";

  // Zod validation error
  if (err instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation error";

    err.issues.forEach((issue) => {
      errorSource.push({
        path: issue.path.join("=>") || "unknown",
        message: issue.message,
      });
    });

    errorMessage = "Invalid request data";
  }

  // Normal Error
  else if (err instanceof Error) {
    errorMessage = err.message;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorMessage,
    errorSource,
  });
};