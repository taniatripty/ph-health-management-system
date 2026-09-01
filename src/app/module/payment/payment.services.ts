// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Stripe from "stripe";
// import { PaymentStatus } from "../../../generated/prisma/enums";
// import { prisma } from "../../lib/prisma";

// const handlerstripeWebhookEvent = async (event: Stripe.Event) => {
//   const existingPayment = await prisma.payment.findFirst({
//     where: {
//       sprtipeEventId: event.id,
//     },
//   });
//   if (existingPayment) {
//     console.log(`Event ${event.id} already processed. Skipping`);
//     return { message: `Event ${event.id} already processed. Skipping` };
//   }
//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object;
//       const paymentId = session.metadata?.paymentId;
//       const appointmentId = session.metadata?.appointmentId;
//       if (!appointmentId || !paymentId) {
//         console.error("Missing appointmentId or paymentId in session metadata");
//         return {
//           message: "Missing appointmentId or paymentId in session metadata",
//         };
//       }
//       const appointment = await prisma.appointment.findFirst({
//         where: {
//           id: appointmentId,
//         },
//       });
//       if (!appointment) {
//         console.error(`Appointment with id ${appointmentId} not found`);
//         return { message: `Appointment with id ${appointmentId} not found` };
//       }
//       await prisma.$transaction(async (tx) => {
//         await tx.appointment.update({
//           where: {
//             id: appointmentId,
//           },
//           data: {
//             paymentStatus:
//               session.payment_status == "paid"
//                 ? PaymentStatus.PAID
//                 : PaymentStatus.UNPAID,
//           },
//         });
//         await tx.payment.update({
//           where: {
//             id: paymentId,
//           },
//           data: {
//             sprtipeEventId: event.id,
//             status:
//               session.payment_status == "paid"
//                 ? PaymentStatus.PAID
//                 : PaymentStatus.UNPAID,
//             paymentGateWayData: session as any,
//           },
//         });
//       });
//       console.log(
//         `Processed checkout.session.completed for appointment ${appointmentId} and payment ${paymentId}`,
//       );
//       break;
//     }
//     case "checkout.session.expired": {
//       const session = event.data.object;

//       console.log(
//         `Checkout session ${session.id} expired. Marking associated payment as failed.`,
//       );
//       break;
//     }
//     case "payment_intent.payment_failed": {
//       const session = event.data.object;

//       console.log(
//         `Payment intent ${session.id} failed. Marking associated payment as failed.`,
//       );
//       break;
//     }
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   return { message: `Webhook Event ${event.id} processed successfully` };
// };

// export const paymentServices = {
//   handlerstripeWebhookEvent,
// };


/* eslint-disable @typescript-eslint/no-explicit-any */

import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const handlerstripeWebhookEvent = async (event: Stripe.Event) => {
  // Prevent duplicate processing
  const existingPayment = await prisma.payment.findFirst({
    where: {
      sprtipeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return {
      message: `Event ${event.id} already processed. Skipping`,
    };
  }

  switch (event.type) {
    // ==========================================
    // CHECKOUT COMPLETED
    // ==========================================

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentId = session.metadata?.paymentId;
      const appointmentId = session.metadata?.appointmentId;

      if (!paymentId || !appointmentId) {
        console.error(
          "Missing paymentId or appointmentId in Stripe metadata",
        );

        return {
          message: "Missing paymentId or appointmentId in Stripe metadata",
        };
      }

      const payment = await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

      if (!payment) {
        console.error(`Payment ${paymentId} not found`);

        return {
          message: `Payment ${paymentId} not found`,
        };
      }

      const appointment = await prisma.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });

      if (!appointment) {
        console.error(`Appointment ${appointmentId} not found`);

        return {
          message: `Appointment ${appointmentId} not found`,
        };
      }

      const isPaid = session.payment_status === "paid";

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            sprtipeEventId: event.id,

            status: isPaid
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,

            paymentGateWayData: session as any,
          },
        });

        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus: isPaid
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
          },
        });
      });

      console.log(
        `Payment ${paymentId} successfully ${
          isPaid ? "paid" : "unpaid"
        } for appointment ${appointmentId}`,
      );

      break;
    }

    // ==========================================
    // CHECKOUT EXPIRED
    // ==========================================

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentId = session.metadata?.paymentId;
      const appointmentId = session.metadata?.appointmentId;
      console.log(appointmentId)

      if (paymentId) {
        await prisma.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            sprtipeEventId: event.id,
            status: PaymentStatus.UNPAID,
            paymentGateWayData: session as any,
          },
        });
      }

      console.log(
        `Checkout session ${session.id} expired`,
      );

      break;
    }

    // ==========================================
    // PAYMENT FAILED
    // ==========================================

    case "payment_intent.payment_failed": {
      const paymentIntent =
        event.data.object as Stripe.PaymentIntent;

      const paymentId = paymentIntent.metadata?.paymentId;
      const appointmentId =
        paymentIntent.metadata?.appointmentId;

      if (paymentId) {
        await prisma.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            sprtipeEventId: event.id,
            status: PaymentStatus.UNPAID,
            paymentGateWayData: paymentIntent as any,
          },
        });
      }

      if (appointmentId) {
        await prisma.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus: PaymentStatus.UNPAID,
          },
        });
      }

      console.log(
        `Payment intent ${paymentIntent.id} failed`,
      );

      break;
    }

    // ==========================================
    // DEFAULT
    // ==========================================

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return {
    message: `Webhook Event ${event.id} processed successfully`,
  };
};

export const paymentServices = {
  handlerstripeWebhookEvent,
};