import { IRequest } from "./requestuser.interface";

declare global {
    namespace Express{
interface Request{
    user:IRequest
}
    }
}