import express, { Application, Request, Response } from "express";
import { IndexsRoute } from "./app/routes";
import { notFound } from "./app/middleware/notFound";




const app: Application = express();



app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1",IndexsRoute);


app.get("/", async (req: Request, res: Response) => {
   res.send('Hello, TypeScript + Express!');
})

app.use(notFound)
export default app;
