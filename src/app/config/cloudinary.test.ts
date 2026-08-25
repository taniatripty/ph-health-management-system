/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";
import { cloudinaryUpload } from "./cloudinary.config";

const testUpload = async () => {
  try {
    console.log("=================================");
    console.log("CLOUDINARY CONFIGURATION");
    console.log("=================================");

    const config = cloudinaryUpload.config();

    console.log("Cloud Name:", config.cloud_name);
    console.log("API Key:", config.api_key);
    console.log("API Secret exists:", Boolean(config.api_secret));

    // --------------------------------
    // Test Cloudinary connection
    // --------------------------------

    console.log("\nTesting Cloudinary connection...");

    const pingResult = await cloudinaryUpload.api.ping();

    console.log("PING SUCCESS:");
    console.dir(pingResult, { depth: null });

    // --------------------------------
    // Image path
    // --------------------------------

    const imagePath = path.resolve(
      "src/app/config/assests/cap52.PNG"
    );

    console.log("\nImage path:");
    console.log(imagePath);

    // --------------------------------
    // Test direct Cloudinary upload
    // --------------------------------

    console.log("\nTesting direct Cloudinary upload...");

    const uploadResult =
      await cloudinaryUpload.uploader.upload(imagePath);

    // --------------------------------
    // Success
    // --------------------------------

    console.log("\n=================================");
    console.log("CLOUDINARY UPLOAD SUCCESS");
    console.log("=================================");

    console.log("Secure URL:");
    console.log(uploadResult.secure_url);

    console.log("\nPublic ID:");
    console.log(uploadResult.public_id);

    console.log("\nResource Type:");
    console.log(uploadResult.resource_type);

    console.log("\nFormat:");
    console.log(uploadResult.format);

    console.log("\n=================================");
  } catch (error: any) {
    // --------------------------------
    // Error
    // --------------------------------

    console.log("\n=================================");
    console.log("CLOUDINARY UPLOAD ERROR");
    console.log("=================================");

    console.log("Message:", error?.message);
    console.log("HTTP Code:", error?.http_code);
    console.log("Name:", error?.name);

    console.log("\nFull Error:");
    console.dir(error, {
      depth: null,
    });

    console.log("\nResponse:");
    console.dir(error?.response, {
      depth: null,
    });

    console.log("\n=================================");
  }
};

testUpload();