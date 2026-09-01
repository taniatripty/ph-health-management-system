// /* eslint-disable @typescript-eslint/no-explicit-any */
// import express, { Application, Request, Response } from "express";
// import { IndexsRoute } from "./app/routes";
// import { notFound } from "./app/middleware/notFound";
// import { globalErrorHandler } from "./app/middleware/globarErrorHandler";
// import cookieParser from "cookie-parser";
// import { toNodeHandler } from "better-auth/node";
// import { auth } from "./app/lib/auth";
// import path from "node:path";
// import cors from "cors"
// import { envVars } from "./app/config/env";
// import { paymentController } from "./app/module/payment/payment.conrtoller";
// import corn from "node-cron"
// import { appointmentServices } from "./app/module/appointment/appointment.services";

// const app: Application = express();
// app.set("view engine","ejs")
// app.set("views",path.resolve(process.cwd(),`src/app/templates`))

// app.post("/webhook", express.raw({ type: "application/json" }),paymentController.handlerStripeWebhookEvent )

// app.use(cors({
//     origin : [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
//     credentials : true,
//     methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders : ["Content-Type", "Authorization"]
// }))

// corn.schedule(" */25 * * * *", async () => {
//     try {
//         console.log("Running cron job to cancel unpaid appointments...");
//         await appointmentServices.cancelUnpaidAppointments();
//     } catch (error : any) {
//         console.error("Error occurred while canceling unpaid appointments:", error.message);    
//     }
// })
// app.use("/api/auth", toNodeHandler(auth))

// app.use(express.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(cookieParser())
// app.use(express.urlencoded({extended:true}))

// app.use("/api/v1",IndexsRoute);


// app.get("/", async (req: Request, res: Response) => {
//    res.send('Healthcare Management System!');
// })
// app.use(globalErrorHandler)
// app.use(notFound)
// export default app;


/* eslint-disable @typescript-eslint/no-explicit-any */

import express, {
  Application,
  Request,
  Response,
} from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { toNodeHandler } from "better-auth/node";
import cron from "node-cron";

import { IndexsRoute } from "./app/routes";
import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globarErrorHandler";

import { auth } from "./app/lib/auth";
import { envVars } from "./app/config/env";

import { appointmentServices } from "./app/module/appointment/appointment.services";
import { PaymentController } from "./app/module/payment/payment.conrtoller";

const app: Application = express();

// ==========================================
// EJS
// ==========================================

app.set("view engine", "ejs");

app.set(
  "views",
  path.resolve(process.cwd(), "src/app/templates"),
);

// ==========================================
// STRIPE WEBHOOK
// ==========================================
// IMPORTANT:
// This must be BEFORE express.json()

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),PaymentController.handleStripeWebhookEvent);

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

// ==========================================
// CRON JOB
// ==========================================

cron.schedule("*/25 * * * *", async () => {
  try {
    console.log(
      "Running cron job to cancel unpaid appointments...",
    );

    await appointmentServices.cancelUnpaidAppointments();
  } catch (error: any) {
    console.error(
      "Error occurred while canceling unpaid appointments:",
      error.message,
    );
  }
});

// ==========================================
// BETTER AUTH
// ==========================================

app.use(
  "/api/auth",
  toNodeHandler(auth),
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/v1",
  IndexsRoute,
);

// ==========================================
// ROOT
// ==========================================

app.get(
  "/",
  async (req: Request, res: Response) => {
    res.send(
      "Healthcare Management System!",
    );
  },
);

// ==========================================
// ERROR HANDLERS
// ==========================================

app.use(globalErrorHandler);

app.use(notFound);

export default app;