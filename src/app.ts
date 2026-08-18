import express, { Application, Request, Response } from "express";
import { IndexsRoute } from "./app/routes";
import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globarErrorHandler";




const app: Application = express();



app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1",IndexsRoute);


app.get("/", async (req: Request, res: Response) => {
   res.send('Healthcare Management System!');
})
app.use(globalErrorHandler)
app.use(notFound)
export default app;
