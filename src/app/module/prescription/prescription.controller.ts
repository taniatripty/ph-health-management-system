import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { prescriptionServices } from "./prescription.services";



const givePrescription = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await prescriptionServices.givePrescription(user,payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "give prescription successfully",
    data: result,
  });
});

export const prescriptionController={
    givePrescription
}
