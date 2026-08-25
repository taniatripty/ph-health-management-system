// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { cloudinaryUpload } from "./cloudinary.config";

// const testUpload = async () => {
//   try {
//     console.log("Starting upload...");

//     const result = await cloudinaryUpload.uploader.upload(
//       "/src/app/config/pictures/cap53.PNG",
//       {
//         folder: "healthcare/test",
//         resource_type: "image",
//       }
//     );

//     console.log("========== SUCCESS ==========");
//     console.log("URL:", result.secure_url);
//     console.log("PUBLIC ID:", result.public_id);
//     console.log("=============================");
//   } catch (error: any) {
//     console.log("========== ERROR ==========");
//     console.log("Message:", error?.message);
//     console.log("HTTP CODE:", error?.http_code);
//     console.log("Name:", error?.name);
//     console.log("Error:", error);
//     console.log("===========================");
//   }
// };

// testUpload();