import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { adminServices } from "./admin.services";

const changeUserStatus = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await adminServices.changeUserStatus(user,payload);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: " Change user status  successfully",
    data: result,
  });
});

const changeUserRole = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await adminServices.changeUserRole(user,payload);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: " Change user role  successfully",
    data: result,
  });
});


export const adminController={
    changeUserStatus,
    changeUserRole
}