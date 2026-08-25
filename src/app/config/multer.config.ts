import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,

  params: async (req, file) => {
    const originalName = file.originalname;

    const extension = originalName
      .split(".")
      .pop()
      ?.toLowerCase();

    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueName =
      `${fileNameWithoutExtension || "file"}-` +
      `${Date.now()}-` +
      `${Math.random().toString(36).substring(2, 8)}`;

    const folder = extension === "pdf" ? "pdfs" : "images";

    return {
      folder: `healthcare/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
    };
  },
});

export const multerUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});