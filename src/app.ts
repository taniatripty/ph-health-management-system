import express, { Application, Request, Response } from "express";
import { IndexsRoute } from "./app/routes";
import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globarErrorHandler";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "node:path";
import cors from "cors"
import { envVars } from "./app/config/env";


const app: Application = express();
app.set("view engine","ejs")
app.set("views",path.resolve(process.cwd(),`src/app/templates`))

app.post("/webhook", express.raw({ type: "application/json" }), async(req:Request,res:Response)=>{
    console.log(" request", req.body)
    res.status(200).json({received:true})

})

app.use(cors({
    origin : [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders : ["Content-Type", "Authorization"]
}))

app.use("/api/auth", toNodeHandler(auth))

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use("/api/v1",IndexsRoute);


app.get("/", async (req: Request, res: Response) => {
   res.send('Healthcare Management System!');
})
app.use(globalErrorHandler)
app.use(notFound)
export default app;
