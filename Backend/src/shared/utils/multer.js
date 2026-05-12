import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "case_documents",
    allowed_formats: ["jpg", "png", "pdf"]
  }
});

export const upload = multer({ storage });