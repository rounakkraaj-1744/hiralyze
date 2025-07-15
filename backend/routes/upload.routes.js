import express from "express"
import { requireAuth } from "../middleware/auth"
import { upload } from "../middleware/upload"
import { ApiResponse } from "../utils/apiResponse"
import { ApiError } from "../utils/apiError"
import { asyncHandler } from "../utils/asyncHandler"

const router = express.Router()

router.use(requireAuth)

router.post(
  "/resume",
  upload.single("resume"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    res.json(
      new ApiResponse(
        200,
        {
          file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
          },
        },
        "Resume uploaded successfully",
      ),
    )
  }),
)

router.post(
  "/photo",
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    res.json(
      new ApiResponse(
        200,
        {
          file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
          },
        },
        "Photo uploaded successfully",
      ),
    )
  }),
)

router.post(
  "/document",
  upload.single("document"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    res.json(
      new ApiResponse(
        200,
        {
          file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
          },
        },
        "Document uploaded successfully",
      ),
    )
  }),
)

module.exports = router