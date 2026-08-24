import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utlis/email";




// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
     emailAndPassword: { 
    enabled: true, 
  }, 
  emailVerification:{
sendOnSignUp:true,
sendOnSignIn:true,
autoSignInAfterVerification:true
  },
  user:{
    additionalFields:{
        role:{
            type:"string",
            required:true,
            defaultValue:Role.PATIENT

        },
        status:{
            type:"string",
            required:true,
            defaultValue:UserStatus.ACTIVE
        },
        needPasswordChange:{
            type:"boolean",
            required:true,
            defaultValue:false
        }
    }
  },
  plugins:[
bearer(),
emailOTP({
  overrideDefaultEmailVerification:true,
  async sendVerificationOTP({email,otp,type}){
    if(type=="email-verification"){
      const user=await prisma.user.findUnique({
        where:{
          email
        }
      })
      if(user && !user.emailVerified){
        sendEmail({
          to:email,
          subject:"varify your email",
          templateName:"otp",
          templateData:{
            name:user.name,
            otp
          }
        })
      }
      
    }
    else if(type==="forget-password"){
      const user=await prisma.user.findUnique({
        where:{
          email
        }
      })
       if(user ){
        sendEmail({
          to:email,
          subject:"password reset otp",
          templateName:"otp",
          templateData:{
            name:user.name,
            otp
          }
        })
      }
    }

  },
   expiresIn : 5 * 60, // 5 minutes in seconds
   otpLength : 6,
})
  ],
  trustedOrigins:[process.env.BETTER_AUTH_URL || "http://localhost:5000"],
  advanced:{
    disableCSRFCheck:true
  },

  session:{
    expiresIn:60*60*60*24,
    updateAge:60*60*60*24,
    cookieCache:{
        enabled:true,
        maxAge:60*60*60*24,
    }
  }
});