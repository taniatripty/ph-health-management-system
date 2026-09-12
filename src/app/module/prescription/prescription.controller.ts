import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { prescriptionServices } from "./prescription.services";

const givePrescription = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;

  console.log("paylod :", payload);
  const result = await prescriptionServices.givePrescription(user, payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "give prescription successfully",
    data: result,
  });
});

const getAllPrescription = catchAsync(async (req, res) => {
  const result = await prescriptionServices.getAllPrescriptions();

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Get All prescription successfully",
    data: result,
  });
});

const deletePrescription = catchAsync(async (req, res) => {
  const user = req.user;
  const prescriptionId = req.params.id;
  const result = await prescriptionServices.deletePrescription(
    user,
    prescriptionId as string,
  );

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Delete prescription successfully",
    data: result,
  });
});

export const prescriptionController = {
  givePrescription,
  getAllPrescription,
  deletePrescription,
};
