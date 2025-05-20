import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import {
  cloudinary_api_key,
  cloudinary_api_secret,
  cloudinary_cloud_name,
} from "../config";

cloudinary.config({
  cloud_name: cloudinary_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

export const uploadToCloudinary = (
  imageName: string,
  path: string
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName.trim().substring(0, imageName.lastIndexOf(".")),
        folder: "portfolio-image",
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File deleted successfully", path);
          }
        });
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

export const upload = multer({ storage: storage });
