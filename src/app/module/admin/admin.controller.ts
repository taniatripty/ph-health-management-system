import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { adminServices } from "./admin.services";

const getAllAdmin = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAdmin();
  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Get all admin  successfully",
    data: result,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getAdminById(id as string);
  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Get  admin  successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  console.log(payload)
  console.log(id)

  const result = await adminServices.updateAdmin(id as string, payload);
  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "update  admin  successfully",
    data: result,
  });
});
 


const deleteAdmin = catchAsync(
    async (req, res) => {
        const { id } = req.params;
        const user = req.user;

        const result = await adminServices.deleteAdmin(id as string, user);

        sendResponse({res, 
            statusCode: status.OK,
            success: true,
            message: "Admin deleted successfully",
            data: result,
        })
    }

)

const changeUserStatus = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;

  console.log("paylod :", payload);
  const result = await adminServices.changeUserStatus(user, payload);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: " Change user status  successfully",
    data: result,
  });
});

const changeUserRole = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;

  console.log("paylod :", payload);
  const result = await adminServices.changeUserRole(user, payload);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: " Change user role  successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changeUserStatus,
  changeUserRole,
};
