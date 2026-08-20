// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { NextFunction, Request, Response } from "express";
// import { cookieUtils } from "../utlis/cookie";
// import { prisma } from "../lib/prisma";
// import { Role, UserStatus } from "../../generated/prisma/enums";
// import { jwtutils } from "../utlis/jwt";
// import { envVars } from "../config/env";

// export const checkAuth=(...authRoles:Role[])=>
//     async(req:Request,res:Response,next:NextFunction)=>{
//         try {
//             const sessionToken=cookieUtils.getCookie(req,"better-auth.session_token")
//             if(!sessionToken){
//                 throw new Error("session is not provided")

//             }
//             if(sessionToken){
//                 const existsesion=await prisma.session.findFirst({
//                     where:{
//                         token:sessionToken,
//                         expiresAt:{
//                             gt:new Date()
                
//                         }
//                     },
//                     include:{
//                         user:true
//                     }
                  
//                 })
//                 if(existsesion && existsesion.user){
//                     const user=existsesion.user
                
//                 const now=new Date();
//                 const expiresAt=new Date(existsesion.expiresAt);
//                 const createdAt= new Date (existsesion.createdAt);
//                 const sessionLifeTime=expiresAt.getTime()-createdAt.getTime()
//                 const reaminingtTime=expiresAt.getTime()-now.getTime()
//                 const percentage=(reaminingtTime/sessionLifeTime)*100
//                 if(percentage<20){
//                     res.setHeader('X-Session-Refresh', 'true');
//                     res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
//                     res.setHeader('X-Time-Remaining', reaminingtTime.toString());
//                     console.log("Session Expiring Soon!!")
//                 }
                
//                 if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
//                     throw new Error( 'Unauthorized access! User is not active.');
//                 }
//            const accessToken = cookieUtils.getCookie(req, 'accessToken');

//             if (!accessToken) {
//                 throw new Error('Unauthorized access! No access token provided.');
//             }
//             }

//            const accessToken = cookieUtils.getCookie(req, 'accessToken');

//             if (!accessToken) {
//                 throw new Error('Unauthorized access! No access token provided.');
//             }
//             const verifytoken=jwtutils.verifyToken(accessToken,envVars.ACCESS_TOKEN_SECRET)
//             if(!verifytoken.success){
//                 throw new Error("Unauthorized access! Invalid access token")
//             }

//             if(authRoles.length>0 && !authRoles.includes(verifytoken.data!.role as Role)){
//                 throw new Error("access is forbiden")
//             }
//        next()
//             }
//         } catch (err:any) {
// next(err)            
//         }
//     }


import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { prisma } from "../lib/prisma";
import { cookieUtils } from "../utlis/cookie";
import { jwtutils } from "../utlis/jwt";


export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ==============================
      // 1. Check Better Auth Session
      // ==============================
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token"
      );

      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided.");
      }

      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!sessionExists || !sessionExists.user) {
        throw new Error("Unauthorized access! Invalid session.");
      }

      const user = sessionExists.user;

      // ==============================
      // 2. Check User Status
      // ==============================
      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.DELETED
      ) {
        throw new Error("Unauthorized access! User is not active.");
      }

      if (user.isDeleted) {
        throw new Error("Unauthorized access! User is deleted.");
      }

      // ==============================
      // 3. Check Session Expiration
      // ==============================
      const now = new Date();
      const expiresAt = new Date(sessionExists.expiresAt);
      const createdAt = new Date(sessionExists.createdAt);

      const sessionLifeTime =
        expiresAt.getTime() - createdAt.getTime();

      const timeRemaining =
        expiresAt.getTime() - now.getTime();

      const percentRemaining =
        (timeRemaining / sessionLifeTime) * 100;

      if (percentRemaining < 20) {
        res.setHeader("X-Session-Refresh", "true");
        res.setHeader(
          "X-Session-Expires-At",
          expiresAt.toISOString()
        );
        res.setHeader(
          "X-Time-Remaining",
          timeRemaining.toString()
        );

        console.log("Session Expiring Soon!!");
      }

      // ==============================
      // 4. Check Access Token
      // ==============================
      const accessToken = cookieUtils.getCookie(
        req,
        "accessToken"
      );

      if (!accessToken) {
        throw new Error(
          "Unauthorized access! No access token provided."
        );
      }

      // ==============================
      // 5. Verify Access Token
      // ==============================
      const verifiedToken = jwtutils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET
      );

      if (!verifiedToken.success) {
        throw new Error(
          "Unauthorized access! Invalid access token."
        );
      }

      // ==============================
      // 6. Check Role
      // ==============================
      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new Error(
          "Forbidden access! You do not have permission to access this resource."
        );
      }

      // ==============================
      // 7. Continue
      // ==============================
      next();
    } catch (error) {
      next(error);
    }
  };