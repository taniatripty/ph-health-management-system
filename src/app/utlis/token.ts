import { JwtPayload, SignOptions } from "jsonwebtoken"
import { jwtutils } from "./jwt"
import { envVars } from "../config/env"
import { cookieUtils } from "./cookie"

import { Response } from "express"



const getAccessToken=(payload:JwtPayload)=>{
    const accessToken=jwtutils.createtoken(payload,
        envVars.ACCESS_TOKEN_SECRET,
        {expiresIn:envVars.ACCESS_TOKEN_EXPIRESIN} as SignOptions
    )
    return accessToken;
}

const getRefreshToken=(payload:JwtPayload)=>{
    const accessToken=jwtutils.createtoken(payload,
        envVars.REFRESH_TOKEN_SECRET,
        {expiresIn:envVars.REFRESHH_TOKEN_EXPIRESIN} as SignOptions
    ) 
    return accessToken;
}

const setAccesstoken=(res:Response,token:string)=>{
    
    cookieUtils.setCookie(res,'accessToken',token,{
          httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        //1 day
        maxAge: 60 * 60 * 24 * 1000
    })
}

const setRefreshTokenCookie = (res: Response, token: string) => {
    cookieUtils.setCookie(res, 'refreshToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        //7d
        maxAge:  60 * 60 * 24 * 1000 * 7,
    });
}


const setBetterAuthCookie = (res: Response, token: string) => {
    cookieUtils.setCookie(res, 'better-auth.session_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        //7d
        maxAge:  60 * 60 * 24 * 1000 ,
    });
}

export const tokenUtils={
    getAccessToken,
    getRefreshToken,
    setAccesstoken,
    setRefreshTokenCookie,
    setBetterAuthCookie
}