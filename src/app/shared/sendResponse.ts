import { Response } from "express";

type TSendResponse<T> = {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

const sendResponse = <T>({
  res,
  statusCode,
  success,
  message,
  data,
}: TSendResponse<T>) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;