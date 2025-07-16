const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const { ApiError } = require("../utils/apiError")
const logger = require("../utils/logger")

class AuthService {
  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email }).select("+password")

      if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid email or password")
      }

      if (!user.isActive) {
        throw new ApiError(401, "Account is deactivated")
      }

      logger.info(`User authenticated: ${email}`)
      return user
    } catch (error) {
      logger.error("Authentication error:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Authentication failed")
    }
  }

  async registerUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new ApiError(400, "User already exists with this email")
      }

      const user = new User(userData)
      await user.save()

      logger.info(`New user registered: ${userData.email}`)
      return user
    } catch (error) {
      logger.error("Registration error:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Registration failed")
    }
  }

  async sendPasswordResetEmail(email) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return
      }
      const resetToken = crypto.randomBytes(32).toString("hex")
      user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000 

      await user.save()

      // TODO: Send email with reset token
      logger.info(`Password reset requested for: ${email}`)
    } catch (error) {
      logger.error("Password reset error:", error)
      throw new ApiError(500, "Failed to send password reset email")
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      })

      if (!user) {
        throw new ApiError(400, "Invalid or expired reset token")
      }

      user.password = newPassword
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined

      await user.save()

      logger.info(`Password reset successful for user: ${user.email}`)
    } catch (error) {
      logger.error("Password reset error:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Password reset failed")
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select("+password")

      if (!user || !(await user.comparePassword(currentPassword))) {
        throw new ApiError(400, "Current password is incorrect")
      }

      user.password = newPassword
      await user.save()

      logger.info(`Password changed for user: ${user.email}`)
    } catch (error) {
      logger.error("Password change error:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Password change failed")
    }
  }
}

module.exports = new AuthService()