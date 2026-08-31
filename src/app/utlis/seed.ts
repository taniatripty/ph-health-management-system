import { Role } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedsuperAdmin = async () => {
 try {
     const isSuperAdminexist = await prisma.user.findFirst({
    where: {
      role: Role.SUPER_ADMIN,
    },
  });
  if (isSuperAdminexist) {
    console.log("already exist sper admin");
    return;
  }
  const superAdminuser = await auth.api.signUpEmail({
    body: {
      email: envVars.SUPER_ADMIN_EMAIL,
      password: envVars.SUPER_ADMIN_PASSWORD,
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      needPasswordChange: false,
      rememberMe: false,
    },
  });
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: superAdminuser.user.id,
      },
      data: {
        emailVerified: true,
      },
    });
    await tx.admin.create({
      data: {
        userId: superAdminuser.user.id,
        name: "Super Admin",
        email: envVars.SUPER_ADMIN_EMAIL,
      },
    });
  });
  const superAdmin=await prisma.admin.findFirst({
    where:{
        email:envVars.SUPER_ADMIN_EMAIL
    },
    include:{
        user:true
    }
  })
  console.log("super admin created",superAdmin)
    
 } catch (error) {
    console.log("Error seeding admin",error)
    await prisma.user.delete({
        where:{
            email:envVars.SUPER_ADMIN_EMAIL
        }
    })
    
 }


};
