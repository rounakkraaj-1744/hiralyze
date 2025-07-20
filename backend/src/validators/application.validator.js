import { body, param } from "express-validator"
import { handleValidationErrors } from "../middleware/validation"

const validateApplication = [
  body("coverLetter").optional().isLength({ max: 2000 }).withMessage("Cover letter must not exceed 2000 characters"),

  param("jobId").isMongoId().withMessage("Invalid job ID"),

  handleValidationErrors,
]

const validateStatusUpdate = [
  body("status")
    .isIn(["reviewing", "shortlisted", "interviewing", "offered", "hired", "rejected"])
    .withMessage("Invalid status"),

  body("note").optional().isLength({ max: 500 }).withMessage("Note must not exceed 500 characters"),

  param("id").isMongoId().withMessage("Invalid application ID"),

  handleValidationErrors,
]

const validateWithdraw = [
  body("reason").optional().isLength({ max: 500 }).withMessage("Reason must not exceed 500 characters"),

  param("id").isMongoId().withMessage("Invalid application ID"),

  handleValidationErrors,
]

const validateNote = [
  body("content")
    .notEmpty()
    .withMessage("Note content is required")
    .isLength({ max: 1000 })
    .withMessage("Note content must not exceed 1000 characters"),

  param("id").isMongoId().withMessage("Invalid application ID"),

  handleValidationErrors,
]

const validateInterview = [
  body("type").isIn(["phone", "video", "onsite", "technical", "hr"]).withMessage("Invalid interview type"),

  body("scheduledAt")
    .isISO8601()
    .withMessage("Invalid scheduled date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Scheduled date must be in the future")
      }
      return true
    }),

  body("duration").isInt({ min: 15, max: 480 }).withMessage("Duration must be between 15 and 480 minutes"),

  param("id").isMongoId().withMessage("Invalid application ID"),

  handleValidationErrors,
]

export {validateApplication, validateStatusUpdate, validateWithdraw, validateNote, validateInterview}