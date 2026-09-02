import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { patientServices } from "./patient.services";


const updateProfile = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await patientServices.updateProfile(user,payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Profile update successfully",
    data: result,
  });
});

export const patientController={
    updateProfile
}
