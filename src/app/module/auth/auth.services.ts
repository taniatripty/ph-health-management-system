
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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

   return {
    ...data,
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

  return data;
};

export const authServices = {
  registerUser,
  loginUser
};