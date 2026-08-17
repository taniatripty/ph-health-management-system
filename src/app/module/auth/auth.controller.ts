import { Request, Response } from "express";

import { authServices } from "./auth.services";
import catchAsync from "../../shared/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});
export const authController = {
  registerUser,
  loginUser
};