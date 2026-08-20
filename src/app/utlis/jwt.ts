/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt , { JwtPayload, SignOptions } from "jsonwebtoken";


const createtoken=(payload:JwtPayload,secret:string,{expiresIn}:SignOptions)=>{
   const token=jwt.sign(payload,secret,{expiresIn})
   return token
}

const verifyToken=(token:string, secret:string)=>{
try {
    const decode=jwt.verify(token,secret) as JwtPayload
    return{
        success:true,
        data:decode
    }

    
} catch (error:any) {
    return{
        success:false,
        message:error.message,
        error
    }
    
}
}

const decodeToken=(token:string)=>{
    const decode=jwt.decode(token) as string 
    return decode
}

export const jwtutils={
    createtoken,
    verifyToken,
    decodeToken
}