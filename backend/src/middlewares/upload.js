import multer from "multer"
import path from "path"
import fs from "fs"
import { ApiError } from "../utils/apiError.js"

// Ensure upload directories exist
const uploadDirs = {
  resumes: "uploads/resumes",
  photos: "uploads/photos",
  documents: "uploads/documents",
  messages: "uploads/messages",
}

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadDirs.documents // default

    if (req.route.path.includes("resume") || req.route.path.includes("apply")) {
      uploadPath = uploadDirs.resumes
    } else if (req.route.path.includes("photo")) {
      uploadPath = uploadDirs.photos
    } else if (req.route.path.includes("message")) {
      uploadPath = uploadDirs.messages
    }

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    resume: [".pdf", ".doc", ".docx"],
    photo: [".jpg", ".jpeg", ".png", ".gif"],
    document: [".pdf", ".doc", ".docx", ".txt"],
    message: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".gif", ".txt"],
  }

  const ext = path.extname(file.originalname).toLowerCase()
  let fileType = "document" // default

  if (req.route.path.includes("resume") || req.route.path.includes("apply")) {
    fileType = "resume"
  }
  else if (req.route.path.includes("photo")) {
    fileType = "photo"
  }
  else if (req.route.path.includes("message")) {
    fileType = "message"
  }

  if (allowedTypes[fileType].includes(ext)) {
    cb(null, true)
  }
  else {
    cb(new ApiError(400, `Invalid file type. Allowed types: ${allowedTypes[fileType].join(", ")}`), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

export { upload }