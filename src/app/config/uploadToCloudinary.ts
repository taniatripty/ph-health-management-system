// import { UploadApiResponse } from "cloudinary";
// import { cloudinaryUpload } from "../config/cloudinary.config";

// export const uploadToCloudinary = (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     const upload = cloudinaryUpload.uploader.upload_stream(
//       {
//         folder: "healthcare/images",
//         resource_type: "image",
//       },
//       (error, result) => {
//         if (error) {
//           console.error("========== CLOUDINARY ERROR ==========");
//           console.dir(error, { depth: null });
//           console.error("======================================");

//           reject(error);
//           return;
//         }

//         if (!result) {
//           reject(new Error("Cloudinary returned no result"));
//           return;
//         }

//         resolve(result);
//       }
//     );

//     upload.end(buffer);
//   });
// };