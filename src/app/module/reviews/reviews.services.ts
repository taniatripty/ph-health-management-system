import status from "http-status";
import { PaymentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorhelper/AppError";
import { IRequest } from "../../interface/requestuser.interface";
import { prisma } from "../../lib/prisma";
import {
  ICreateReviewPayload,
  IUpdateReviewPayload,
} from "./reviews.interface";

const giveReview = async (user: IRequest, payload: ICreateReviewPayload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });
  if (appointmentData.paymentStatus! === PaymentStatus.PAID) {
    throw new AppError(
      status.BAD_REQUEST,
      "you can give review after payment is done",
    );
  }
  if (appointmentData.patientId === patientData.id) {
    throw new AppError(
      status.BAD_REQUEST,
      "you can give review only rour own appointment",
    );
  }
  const isReview = await prisma.review.findFirst({
    where: {
      appointmentId: payload.appointmentId,
    },
  });
  if (isReview) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already reviewed for this appointment. You can update your review instead.",
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        ...payload,
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
      },
    });
    const averateRatting = await tx.review.aggregate({
      where: {
        doctorId: appointmentData.doctorId,
      },
      _avg: {
        ratting: true,
      },
    });
    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: averateRatting._avg.ratting as number,
      },
    });
    return review;
  });
  return result;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  return reviews;
};

const myReviews = async (user: IRequest) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });
  if (!isUserExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "Only patients can view their reviews",
    );
  }

  if (isUserExist.role === Role.DOCTOR) {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user?.email,
      },
    });
    return await prisma.review.findMany({
      where: {
        doctorId: doctorData.id,
      },
      include: {
        patient: true,
        appointment: true,
      },
    });
  }

  if (isUserExist.role === Role.PATIENT) {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user?.email,
      },
    });
    return await prisma.review.findMany({
      where: {
        patientId: patientData.id,
      },
      include: {
        doctor: true,
        appointment: true,
      },
    });
  }
};

const updateReview = async (
  user: IRequest,
  reviewId: string,
  payload: IUpdateReviewPayload,
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError(status.BAD_REQUEST, "This is not your review!");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: {
        id: reviewId,
      },
      data: {
        ...payload,
      },
    });

    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: reviewData.doctorId,
      },
      _avg: {
        ratting: true,
      },
    });

    await tx.doctor.update({
      where: {
        id: updatedReview.doctorId,
      },
      data: {
        averageRating: averageRating._avg.ratting as number,
      },
    });

    return updatedReview;
  });

  return result;
};

const deleteReview = async (user: IRequest, reviewId: string) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError(status.BAD_REQUEST, "This is not your review!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const deletedReview = await tx.review.delete({
      where: {
        id: reviewId,
      },
    });

    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: deletedReview.doctorId,
      },
      _avg: {
        ratting: true,
      },
    });

    await tx.doctor.update({
      where: {
        id: deletedReview.doctorId,
      },
      data: {
        averageRating: averageRating._avg.ratting as number,
      },
    });
    return deletedReview;
  });

  return result;
};

export const reviewServices = {
  giveReview,
  getAllReviews,
  myReviews,
  deleteReview,
  updateReview,
};
