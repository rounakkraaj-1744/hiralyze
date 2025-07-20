import express from "express"
import { requireAuth } from "../middlewares/auth.js"
import { handleMulterError, upload } from "../middlewares/upload.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import s3Service from "../services/s3.service.js"

const router = express.Router()

router.use(requireAuth)

router.post(
  "/resume",
  upload.single("resume"),
  handleMulterError,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    try {
      const s3Upload = await s3Service.uploadFile(req.file, "resumes")

      res.json(
        new ApiResponse(
          200,
          {
            file: {
              s3Key: s3Upload.key,
              s3Url: s3Upload.url,
              bucket: s3Upload.bucket,
              filename: s3Upload.key.split("/").pop(),
              originalName: s3Upload.originalName,
              size: s3Upload.size,
              mimetype: s3Upload.mimetype,
            },
          },
          "Resume uploaded successfully",
        ),
      )
    } catch (error) {
      throw new ApiError(500, `Failed to upload resume: ${error.message}`)
    }
  }),
)

router.post(
  "/photo",
  upload.single("photo"),
  handleMulterError,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    try {
      const s3Upload = await s3Service.uploadFile(req.file, "photos")

      res.json(
        new ApiResponse(
          200,
          {
            file: {
              s3Key: s3Upload.key,
              s3Url: s3Upload.url,
              bucket: s3Upload.bucket,
              filename: s3Upload.key.split("/").pop(),
              originalName: s3Upload.originalName,
              size: s3Upload.size,
              mimetype: s3Upload.mimetype,
            },
          },
          "Photo uploaded successfully",
        ),
      )
    } catch (error) {
      throw new ApiError(500, `Failed to upload photo: ${error.message}`)
    }
  }),
)

router.post(
  "/document",
  upload.single("document"),
  handleMulterError,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    try {
      const s3Upload = await s3Service.uploadFile(req.file, "documents")

      res.json(
        new ApiResponse(
          200,
          {
            file: {
              s3Key: s3Upload.key,
              s3Url: s3Upload.url,
              bucket: s3Upload.bucket,
              filename: s3Upload.key.split("/").pop(),
              originalName: s3Upload.originalName,
              size: s3Upload.size,
              mimetype: s3Upload.mimetype,
            },
          },
          "Document uploaded successfully",
        ),
      )
    } catch (error) {
      throw new ApiError(500, `Failed to upload document: ${error.message}`)
    }
  }),
)

router.get(
  "/signed-url/:s3Key",
  asyncHandler(async (req, res) => {
    const { s3Key } = req.params
    const { expiresIn = 3600 } = req.query 

    try {
      const signedUrl = await s3Service.getSignedUrl(s3Key, Number.parseInt(expiresIn))

      res.json(
        new ApiResponse(
          200,
          {
            signedUrl,
            expiresIn: Number.parseInt(expiresIn),
          },
          "Signed URL generated successfully",
        ),
      )
    } catch (error) {
      throw new ApiError(500, `Failed to generate signed URL: ${error.message}`)
    }
  }),
)

export default router