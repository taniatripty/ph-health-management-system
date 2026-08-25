

import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { specialityService } from "./speciality.services";

const createSpeciality = catchAsync(async (req , res) => {
  const payload=
  {...req.body,
    icon:req.file?.path
  }
  console.log( "file" ,req.file)
  console.log(payload)
  const result = await specialityService.createSpeciality(payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Speciality created successfully",
    data: result,
  });
});





// const createSpeciality = catchAsync(async (req, res) => {
//   console.log("========== REQUEST BODY ==========");
//   console.log(req.body);

//   console.log("========== REQUEST FILE ==========");
//   console.log(req.file);

//   let icon: string | undefined;

//   // Upload image to Cloudinary
//   if (req.file) {
//     const fileName = req.file.originalname
//       .split(".")
//       .slice(0, -1)
//       .join(".")
//       .replace(/[^a-zA-Z0-9-_]/g, "-");

//     const uploadResult = await uploadToCloudinary(
//       req.file.buffer,
//       fileName
//     );

//     icon = uploadResult.secure_url;

//     console.log("========== CLOUDINARY UPLOAD ==========");
//     console.log("URL:", uploadResult.secure_url);
//     console.log("Public ID:", uploadResult.public_id);
//   }

//   // Create final payload
//   const payload = {
//     ...req.body,
//     icon,
//   };

//   console.log("========== FINAL PAYLOAD ==========");
//   console.log(payload);

//   const result =
//     await specialityService.createSpeciality(payload);

//   sendResponse({
//     res,
//     statusCode: 201,
//     success: true,
//     message: "Speciality created successfully",
//     data: result,
//   });
// });



export const specialityController = {
  createSpeciality,
 
};