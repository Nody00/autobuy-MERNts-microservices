import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { cloudinary } from "../config/cloudinary";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "vehicle-listings",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    resource_type: "auto",
  } as any,
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_LIMIT, // 5MB limit
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
}).array("images", 5);

export const uploadMiddleware = (req: any, res: any, next: any) => {
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // An unknown error occurred
      console.error(err);
      return res.status(500).json({
        message: `Error: ${err.message}`,
      });
    }
    // Everything went fine
    next();
  });
};
