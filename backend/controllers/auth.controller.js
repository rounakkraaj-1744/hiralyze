import passport from "passport"
import authService from "../services/auth.service"
import userService from"../services/user.service"
import { ApiResponse } from "../utils/apiResponse"
import { ApiError } from "../utils/apiError"
import { asyncHandler } from "../utils/asyncHandler"
import logger from "../utils/logger"

class AuthController {
  // Google OAuth
  googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
  })

  googleCallback = asyncHandler(async (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/login" }, async (err, user) => {
      if (err) {
        logger.error("Google OAuth error:", err)
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_failed`)
      }

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_cancelled`)
      }

      req.logIn(user, (err) => {
        if (err) {
          logger.error("Login error:", err)
          return res.redirect(`${process.env.FRONTEND_URL}/auth?error=login_failed`)
        }

        // Update last login
        user.updateLastLogin()

        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
      })
    })(req, res, next)
  })

  // LinkedIn OAuth
  linkedinAuth = passport.authenticate("linkedin")

  linkedinCallback = asyncHandler(async (req, res, next) => {
    passport.authenticate("linkedin", { failureRedirect: "/login" }, async (err, user) => {
      if (err) {
        logger.error("LinkedIn OAuth error:", err)
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_failed`)
      }

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_cancelled`)
      }

      req.logIn(user, (err) => {
        if (err) {
          logger.error("Login error:", err)
          return res.redirect(`${process.env.FRONTEND_URL}/auth?error=login_failed`)
        }

        // Update last login
        user.updateLastLogin()

        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
      })
    })(req, res, next)
  })

  // Local login
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required")
    }

    const user = await authService.authenticateUser(email, password)

    req.logIn(user, (err) => {
      if (err) {
        logger.error("Login error:", err)
        throw new ApiError(500, "Login failed")
      }

      // Update last login
      user.updateLastLogin()

      res.json(
        new ApiResponse(
          200,
          {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              profilePhoto: user.profilePhoto,
            },
          },
          "Login successful",
        ),
      )
    })
  })

  // Register
  register = asyncHandler(async (req, res) => {
    const userData = req.body
    const user = await authService.registerUser(userData)

    req.logIn(user, (err) => {
      if (err) {
        logger.error("Registration login error:", err)
        throw new ApiError(500, "Registration successful but login failed")
      }

      res.status(201).json(
        new ApiResponse(
          201,
          {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              profilePhoto: user.profilePhoto,
            },
          },
          "Registration successful",
        ),
      )
    })
  })

  // Logout
  logout = asyncHandler(async (req, res) => {
    req.logout((err) => {
      if (err) {
        logger.error("Logout error:", err)
        throw new ApiError(500, "Logout failed")
      }

      req.session.destroy((err) => {
        if (err) {
          logger.error("Session destroy error:", err)
        }

        res.json(new ApiResponse(200, null, "Logout successful"))
      })
    })
  })

  // Get current user
  getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated")
    }

    const user = await userService.findById(req.user.id)

    res.json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto,
            profile: user.profile,
            settings: user.settings,
          },
        },
        "User retrieved successfully",
      ),
    )
  })

  // Forgot password
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
      throw new ApiError(400, "Email is required")
    }

    await authService.sendPasswordResetEmail(email)

    res.json(new ApiResponse(200, null, "Password reset email sent"))
  })

  // Reset password
  resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body

    if (!token || !password) {
      throw new ApiError(400, "Token and password are required")
    }

    await authService.resetPassword(token, password)

    res.json(new ApiResponse(200, null, "Password reset successful"))
  })

  // Change password
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required")
    }

    await authService.changePassword(req.user.id, currentPassword, newPassword)

    res.json(new ApiResponse(200, null, "Password changed successfully"))
  })
}

module.exports = new AuthController()
