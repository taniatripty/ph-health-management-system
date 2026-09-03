

import { v2 as cloudinary,  UploadApiResponse } from "cloudinary";
import { envVars } from "./env";




cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary=async(buffer:Buffer,filename:string):Promise<UploadApiResponse>=>{
 if(!buffer || !filename){
  throw new Error("file is not found")
 }

  const extension = filename.split(".").pop()?.toLowerCase();

        const fileNameWithoutExtension = filename
            .split(".")
            .slice(0, -1)
            .join(".")
            .toLowerCase()
            .replace(/\s+/g, "-")
            // eslint-disable-next-line no-useless-escape
            .replace(/[^a-z0-9\-]/g, "");

        const uniqueName =
            Math.random().toString(36).substring(2)+
            "-"+
            Date.now()+
            "-"+
            fileNameWithoutExtension;

        const folder = extension === "pdf" ? "pdfs" : "images";
        

        return new Promise((resolve,reject)=>{
          cloudinary.uploader.upload_stream({
            resource_type:"auto",
            public_id:`ph-healcare/${folder}/${uniqueName}`,
            folder:`ph-healcare/${folder}`
          },(error,result)=>{
            if(error){
              return reject( new Error("failde to upload"))
            }
           
            resolve(result as UploadApiResponse)
          }
        ).end(buffer)

        })

}



export const deleteFileFromCloudinary = async (url: string) => {
    try {
        if (!url) {
            throw new Error("Cloudinary URL is required");
        }

        const urlObject = new URL(url);

        const pathname = urlObject.pathname;

        // Example:
        // /image/upload/v123456/ph-healcare/images/file.jpg
        // /raw/upload/v123456/ph-healcare/pdfs/file.pdf

        const resourceType = pathname.includes("/raw/upload/")
            ? "raw"
            : "image";

        const uploadMarker = `/${resourceType}/upload/`;

        const uploadIndex = pathname.indexOf(uploadMarker);

        if (uploadIndex === -1) {
            throw new Error("Invalid Cloudinary URL");
        }

        let publicId = pathname.substring(
            uploadIndex + uploadMarker.length
        );

        // Remove version
        publicId = publicId.replace(/^v\d+\//, "");

        // Remove extension
        publicId = publicId.replace(/\.[^/.]+$/, "");

        console.log("Deleting Cloudinary file:");
        console.log("publicId:", publicId);
        console.log("resourceType:", resourceType);

        const result = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: resourceType
            }
        );

        console.log("Cloudinary delete result:", result);

        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(
                `Cloudinary deletion failed: ${result.result}`
            );
        }

        return result;

    } catch (error) {
        console.error(
            "Error deleting file from Cloudinary:",
            error
        );

        throw new Error(
            "Failed to delete file from Cloudinary",
            {
                cause: error
            }
        );
    }
};



  
export const cloudinaryUpload = cloudinary;