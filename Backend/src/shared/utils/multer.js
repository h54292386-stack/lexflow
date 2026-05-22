import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "legal_platform",
    resource_type: "auto",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "pdf",
      "mp4",
      "mov",
      "avi",
      "mkv"
    ]
  }
});

const fileFilter = (req, file, cb) => {
 const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, and videos are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 
  }
});

