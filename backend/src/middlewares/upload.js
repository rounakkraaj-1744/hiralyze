import multer from "multer"
import path from "path"
import fs from "fs"
import { ApiError } from "../utils/apiError.js"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for temporary local storage before S3 upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const fileExtension = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension)
  },
})

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    resume: [".pdf", ".doc", ".docx"],
    photo: [".jpg", ".jpeg", ".png", ".gif"],
    document: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
  }

  const fileExtension = path.extname(file.originalname).toLowerCase()
  const fieldName = file.fieldname

  // Check if field name is valid
  if (!allowedTypes[fieldName]) {
    return cb(new ApiError(400, `Invalid field name: ${fieldName}`), false)
  }

  // Check if file type is allowed for this field
  if (!allowedTypes[fieldName].includes(fileExtension)) {
    return cb(
      new ApiError(400, `Invalid file type for ${fieldName}. Allowed types: ${allowedTypes[fieldName].join(", ")}`),
      false,
    )
  }

  cb(null, true)
}

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only one file at a time
  },
})

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(new ApiError(400, "File too large. Maximum size is 10MB"))
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return next(new ApiError(400, "Too many files. Only one file allowed"))
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new ApiError(400, "Unexpected field name"))
    }
  }
  next(error)
}

export {upload, handleMulterError}