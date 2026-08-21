import { Role } from "../../generated/prisma/enums"


export interface IRequest{
    userId:string,
    role:Role,
    email:string
   
}