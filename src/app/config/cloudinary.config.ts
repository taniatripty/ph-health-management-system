

import { v2 as cloudinary,  UploadApiResponse } from "cloudinary";
import { envVars } from "./env";




cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary=async(buffer:string,filename:string):Promise<UploadApiResponse>=>{
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

export const deleteFileFromCloudinary = async (url : string) => {

    try {
        const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

        const match = url.match(regex);

        if (match && match[1]) {
            const publicId = match[1];

            await cloudinary.uploader.destroy(
                publicId, {
                resource_type: "image"
            }
            )

            console.log(`File ${publicId} deleted from cloudinary`);
        }

    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw new Error( "Failed to delete file from Cloudinary",{
          cause:error
        });
    }
}



  
export const cloudinaryUpload = cloudinary;