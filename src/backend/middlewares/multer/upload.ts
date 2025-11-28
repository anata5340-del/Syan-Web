import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION, // AWS region from .env
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // AWS access key from .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "", // AWS secret key from .env
  },
});

// Multer S3 Storage
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME || "", // S3 bucket name from .env
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}` // File name
    );
  },
  contentDisposition: "inline",
});

// Multer Middleware
export const upload = multer({
  storage: s3Storage,
});
