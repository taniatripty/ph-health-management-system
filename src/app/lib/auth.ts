import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer } from "better-auth/plugins";



// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
     emailAndPassword: { 
    enabled: true, 
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
bearer()
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