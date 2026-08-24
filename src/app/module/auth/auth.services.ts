
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "../../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { IRequest } from "../../interface/requestuser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtutils } from "../../utlis/jwt";
import { tokenUtils } from "../../utlis/token";
import { IChangePasswordPayload } from "./auth.interface";


type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
};
type LoginUserPayload = {
  email: string;
  password: string;
};

const registerUser = async (payload: RegisterUserPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
     // role: Role.PATIENT,
    },
  });

  if (!data.user){
throw new Error ("failed to register patient")
  }

 try {
  const patient= await prisma.$transaction(async(tx)=>{

    const patientx=await tx.patient.create({
      data:{
        userId:data.user.id,
        name:data.user.name,
        email:data.user.email
      }
    })

    return patientx
  })

  const accessToken =tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        
        emailVerified: data.user.emailVerified,
    });


   return {
    ...data,
    accessToken,
    refreshToken,
    patient
  };
  
 } catch (error) {
  console.log("throw error",error)
  await prisma.user.delete({
    where:{
      id:data.user.id
    }
  })
  throw error
 }

  

 
};

const loginUser = async (payload: LoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if(data.user.status==UserStatus.BLOCKED){
    throw new Error("user is blocked")
  }

   const accessToken =tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        
        emailVerified: data.user.emailVerified,
    });

  return {
    ...data,
    accessToken,
    refreshToken
  }
};

const getme=async(user:IRequest)=>{
  const existUser=await prisma.user.findUnique({
    where:{
      id:user.userId
    },
    include:{
      patient:true,
      doctor:{
        include:{
          specialties:true
        }
      }
    }
  })
  if(!existUser){
    throw new Error(`user is not exist`)
  }
return existUser

}

const getnewToken=async(refreshToken:string,sessionToken:string)=>{
  const sessionTokenExists= await prisma.session.findFirst({
    where:{
      token:sessionToken
    },
    include:{
      user:true
    }
  })
  if(!sessionTokenExists){
    throw new Error(`user is not exists`)
  }

  
  const varifyRefreshToken= jwtutils.verifyToken(refreshToken,envVars.REFRESH_TOKEN_SECRET)
  if(!varifyRefreshToken.success && varifyRefreshToken.error){
    throw new Error(`invalid refresh token`)
  }
 const data=  varifyRefreshToken.data as JwtPayload
   const newaccessToken =tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        emailVerified: data.emailVerified,
    });

    const newrefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        
        emailVerified: data.emailVerified,
    });

    const {token}=await prisma.session.update({
      where:{
        token:sessionToken
      },
       data : {
            token : sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }

        
    })

     return {
        accessToken :newaccessToken,
        refreshToken :newrefreshToken,
        sessionToken : token
    }

}



const changePassword = async (payload : IChangePasswordPayload, sessionToken : string) =>{
    const session = await auth.api.getSession({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(!session){
        throw new Error( "Invalid session token");
    }

    const {currentPassword, newPassword} = payload;

    const result = await auth.api.changePassword({
        body :{
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(session.user.needPasswordChange){
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                needPasswordChange: false,
            }
        })
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
      
        emailVerified: session.user.emailVerified,
    });
    

    return {
        ...result,
        accessToken,
        refreshToken,
    }
  }

  const logoutUser = async (sessionToken : string) => {
    const result = await auth.api.signOut({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    return result;
}


const verifyEmail=async(email:string,otp:string)=>{
  const result= await auth.api.verifyEmailOTP({
    body:{
      email,
      otp
    }
  })
  if(result.status && !result.user.emailVerified){
    await prisma.user.update({
      where:{
        email
      },
      data:{
        emailVerified:true
      }
    })
  }

}

const forgetPassword=async(email:string)=>{
  const isExistsuser=await prisma.user.findUnique({
    where:{
      email
    }
  })
  if(!isExistsuser){
    throw new Error("user is not found")

  }
    if(!isExistsuser.emailVerified){
        throw new Error( "Email not verified");
    }

    if(isExistsuser.isDeleted || isExistsuser.status === UserStatus.DELETED){
        throw new Error("User not found"); 
    }

    await auth.api.requestPasswordResetEmailOTP({
      body:{
        email
      }
    })
}

const resetPassword=async(email:string,otp:string,newPassword:string)=>{
  const isExistsuser=await prisma.user.findUnique({
    where:{
      email
    }
  })
  if(!isExistsuser){
    throw new Error("user is not found")

  }
    if(!isExistsuser.emailVerified){
        throw new Error( "Email not verified");
    }

    if(isExistsuser.isDeleted || isExistsuser.status === UserStatus.DELETED){
        throw new Error("User not found"); 
    }

    await auth.api.resetPasswordEmailOTP({
      body:{
        email,
        otp,
        password:newPassword
      }
    })
    if (isExistsuser.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: isExistsuser.id,
            },
            data: {
                needPasswordChange: false,
            }
        })
    }

    await prisma.session.deleteMany({
        where:{
            userId :isExistsuser.id,
        }
    })
}



export const authServices = {
  registerUser,
  loginUser,
  getme,
  getnewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword
};