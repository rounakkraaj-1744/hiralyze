import { ApiError } from "../utils/apiError"
import logger from "../utils/logger"

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  logger.error(err)

  if (err.name === "CastError") {
    const message = "Resource not found"
    error = new ApiError(404, message)
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered"
    error = new ApiError(400, message)
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
    error = new ApiError(400, message)
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    error = new ApiError(400, "File too large")
  }

  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token")
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired")
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

export default errorHandler