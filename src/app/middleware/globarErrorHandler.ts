/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVars } from "../config/env";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler:", err);
  }

  const statusCode = status.INTERNAL_SERVER_ERROR;

  let message = "Internal server error";

  if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err instanceof Error ? err.message : "Unknown error",
  });
};