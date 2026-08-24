import { Request, Response } from "express";

import status from "http-status";
import { envVars } from "../../config/env";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { cookieUtils } from "../../utlis/cookie";
import { tokenUtils } from "../../utlis/token";
import { authServices } from "./auth.services";
import { auth } from "../../lib/auth";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);

  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccesstoken(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthCookie(res, token as string);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccesstoken(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  console.log({ user });
  const result = await authServices.getme(user);
  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

const getnewToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new Error(`no refresh Token`);
  }
  const result = await authServices.getnewToken(
    refreshToken,
    betterAuthSessionToken,
  );
  const { accessToken, refreshToken: newrefreshToken, sessionToken } = result;
  tokenUtils.setAccesstoken(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newrefreshToken);
  tokenUtils.setBetterAuthCookie(res, sessionToken);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newrefreshToken,
      sessionToken,
    },
  });
};

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];

  const result = await authServices.changePassword(
    payload,
    betterAuthSessionToken,
  );

  const { accessToken, refreshToken, token } = result;

  tokenUtils.setAccesstoken(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthCookie(res, token as string);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authServices.logoutUser(betterAuthSessionToken);
  cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authServices.verifyEmail(email, otp);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Email verified successfully",
  });
});

const forgetpassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authServices.forgetPassword(email);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: " forget password successfully",
  });
});

const resetpassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await authServices.resetPassword(email, otp, newPassword);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: " reset password successfully",
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect as string || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirects", {
    callbackURL: callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
  });
});



const googleloginSuccess = catchAsync(
    async (req: Request, res: Response) => {
        const redirectPath =
            typeof req.query.redirect === "string"
                ? req.query.redirect
                : "/dashboard";

        const sessionToken = req.cookies["better-auth.session_token"];

        // No session token
        if (!sessionToken) {
            return res.redirect(
                `${envVars.FRONTEND_URL}/login?error=oauth_failed`
            );
        }

        // Get Better Auth session
        const session = await auth.api.getSession({
            headers: {
                cookie: `better-auth.session_token=${sessionToken}`,
            },
        });

        // No session/user
        if (!session?.user) {
            return res.redirect(
                `${envVars.FRONTEND_URL}/login?error=no_user_found`
            );
        }

        // Generate application JWT tokens
        const result = await authServices.googleLoginSuccess(session);

        const { accessToken, refreshToken } = result;

        // Set cookies
        tokenUtils.setAccesstoken(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res,refreshToken);

        // Prevent open redirect
        const isValidRedirectPath =
            redirectPath.startsWith("/") &&
            !redirectPath.startsWith("//");

        const finalRedirectPath = isValidRedirectPath
            ? redirectPath
            : "/dashboard";

        // Redirect frontend
        return res.redirect(
            `${envVars.FRONTEND_URL}${finalRedirectPath}`
        );
    }
);

const handleOAuthError = catchAsync((req: Request, res: Response) => {
    const error = req.query.error as string || "oauth_failed";
    res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
})

export const authController = {
  registerUser,
  loginUser,
  getMe,
  getnewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetpassword,
  resetpassword,
  googleLogin,
  googleloginSuccess,
  handleOAuthError
};
