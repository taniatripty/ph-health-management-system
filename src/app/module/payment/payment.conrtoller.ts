/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import Stripe from "stripe";
import { envVars } from "../../config/env";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { paymentServices } from "./payment.services";

const handlerStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "Missing Stripe signature or webhook secret" });
    }
    let event;
    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      console.error("Error processing Stripe webhook:", error);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "Error processing Stripe webhook" });
    }
    try {
      const result = await paymentServices.handlerstripeWebhookEvent(event);
      sendResponse({
        res,
        statusCode: status.OK,
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      sendResponse({
        res,
        statusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error handling Stripe webhook event",
      });
    }
  },
);

export const paymentController = {
  handlerStripeWebhookEvent,
};
