
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utlis/token";

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

export const authServices = {
  registerUser,
  loginUser
};