import { ApiError } from "../utils/apiError"
import logger from "../utils/logger"

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    return next()
  }

  logger.warn(`Unauthorized access attempt to ${req.path}`)
  throw new ApiError(401, "Authentication required")
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated() || !req.user) {
      throw new ApiError(401, "Authentication required")
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role} to ${req.path}`)
      throw new ApiError(403, "Insufficient permissions")
    }

    next()
  }
}

const optionalAuth = (req, res, next) => {
  next()
}

export { requireAuth, requireRole, optionalAuth }