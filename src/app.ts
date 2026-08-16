import express, { Application, Request, Response } from "express";
import { specialityRoute } from "./app/module/speciality/speciality.routes";



const app: Application = express();



app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1/specialities", specialityRoute);


app.get("/", async (req: Request, res: Response) => {
   res.send('Hello, TypeScript + Express!');
})

export default app;
