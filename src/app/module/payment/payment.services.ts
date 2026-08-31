/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const handlerstripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      sprtipeEventId: event.id,
    },
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      const appointmentId = session.metadata?.appointmentId;
      if (!appointmentId || !paymentId) {
        console.error("Missing appointmentId or paymentId in session metadata");
        return {
          message: "Missing appointmentId or paymentId in session metadata",
        };
      }
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
        },
      });
      if (!appointment) {
        console.error(`Appointment with id ${appointmentId} not found`);
        return { message: `Appointment with id ${appointmentId} not found` };
      }
      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus:
              session.payment_status == "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });
        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            sprtipeEventId: event.id,
            status:
              session.payment_status == "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGateWayData: session as any,
          },
        });
      });
      console.log(
        `Processed checkout.session.completed for appointment ${appointmentId} and payment ${paymentId}`,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;

      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;

      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const paymentServices = {
  handlerstripeWebhookEvent,
};
