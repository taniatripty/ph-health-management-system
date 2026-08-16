import express, { Application, Request, Response } from "express";
import { specialityRoute } from "./app/module/speciality/speciality.routes";



const app: Application = express();
// The port your express server will be running on.

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1/specialities", specialityRoute);

// Basic route
app.get("/", async (req: Request, res: Response) => {
   res.send('Hello, TypeScript + Express!');
})

export default app;
