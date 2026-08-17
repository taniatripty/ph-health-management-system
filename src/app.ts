import express, { Application, Request, Response } from "express";
import { IndexsRoute } from "./app/routes";




const app: Application = express();



app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1",IndexsRoute);


app.get("/", async (req: Request, res: Response) => {
   res.send('Hello, TypeScript + Express!');
})

export default app;
