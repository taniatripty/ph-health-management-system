import { Response } from "express";

type TSendResponse<T> = {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta ?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
};

const sendResponse = <T>({
  res,
  statusCode,
  success,
  message,
  data,
  meta
}: TSendResponse<T>) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    meta
  });
};

export default sendResponse;