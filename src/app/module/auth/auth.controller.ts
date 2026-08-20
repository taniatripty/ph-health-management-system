import { Request, Response } from "express";

import { authServices } from "./auth.services";
import catchAsync from "../../shared/catchAsync";
import { tokenUtils } from "../../utlis/token";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);

   const {accessToken,refreshToken,token,...rest}=result
  tokenUtils.setAccesstoken(res,accessToken)
  tokenUtils.setRefreshTokenCookie(res,refreshToken)
  tokenUtils.setBetterAuthCookie(res,token as string)

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
       token,
      accessToken,
      refreshToken,
      ...rest
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);
  const {accessToken,refreshToken,token,...rest}=result
  tokenUtils.setAccesstoken(res,accessToken)
  tokenUtils.setRefreshTokenCookie(res,refreshToken)
  tokenUtils.setBetterAuthCookie(res,token)

  res.status(200).json({
    success: true,
    message: "Login successful",
    data:{
      token,
      accessToken,
      refreshToken,
      ...rest
    },
  });
});
export const authController = {
  registerUser,
  loginUser
};