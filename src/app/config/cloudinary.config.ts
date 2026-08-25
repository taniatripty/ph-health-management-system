// import { v2 as cloudinary } from "cloudinary"
// import { envVars } from "./env"

// cloudinary.config({
//     cloud_name:envVars.CLOUDINARY_CLOUD_NAME,
//     api_key:envVars.CLOUDINARY_API_KEY,
//     api_secret:envVars.CLOUDINARY_API_SECRET,
    
// })
//  console.log("Cloudinary:");


// export const cloudinaryUpload=cloudinary

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    return Promise.reject(
      new Error("File buffer and file name are required for upload")
    );
  }

  const extension = fileName
    .split(".")
    .pop()
    ?.toLowerCase();

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const uniqueName =
    `${fileNameWithoutExtension || "file"}-` +
    `${Date.now()}-` +
    `${Math.random().toString(36).substring(2, 8)}`;

  const folder =
    extension === "pdf"
      ? "ph-healthcare/pdfs"
      : "ph-healthcare/images";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uniqueName,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};
export const cloudinaryUpload = cloudinary;