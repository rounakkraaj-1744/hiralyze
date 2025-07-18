import userService from "../services/user.service.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

class UserController {
  // Get user profile
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id || req.user.id
    const user = await userService.findById(userId)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    res.json(new ApiResponse(200, { user }, "Profile retrieved successfully"))
  })

  // Update user profile
  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const updateData = req.body

    const user = await userService.updateProfile(userId, updateData)

    res.json(new ApiResponse(200, { user }, "Profile updated successfully"))
  })

  // Update user settings
  updateSettings = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const settings = req.body

    const user = await userService.updateSettings(userId, settings)

    res.json(new ApiResponse(200, { user }, "Settings updated successfully"))
  })

  // Upload profile photo
  uploadProfilePhoto = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    const userId = req.user.id
    const photoPath = req.file.path

    const user = await userService.updateProfilePhoto(userId, photoPath)

    res.json(new ApiResponse(200, { user }, "Profile photo updated successfully"))
  })

  // Get user statistics
  getStats = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const stats = await userService.getUserStats(userId)

    res.json(new ApiResponse(200, { stats }, "Statistics retrieved successfully"))
  })

  // Search users
  searchUsers = asyncHandler(async (req, res) => {
    const { query, role, page = 1, limit = 10 } = req.query

    const result = await userService.searchUsers({
      query,
      role,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.json(new ApiResponse(200, result, "Users retrieved successfully"))
  })

  // Deactivate account
  deactivateAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id

    await userService.deactivateAccount(userId)

    // Logout user
    req.logout((err) => {
      if (err) {
        throw new ApiError(500, "Account deactivated but logout failed")
      }

      res.json(new ApiResponse(200, null, "Account deactivated successfully"))
    })
  })

  // Delete account
  deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const { password } = req.body

    if (!password) {
      throw new ApiError(400, "Password is required to delete account")
    }

    await userService.deleteAccount(userId, password)

    // Logout user
    req.logout((err) => {
      if (err) {
        throw new ApiError(500, "Account deleted but logout failed")
      }

      res.json(new ApiResponse(200, null, "Account deleted successfully"))
    })
  })
}

export default new UserController()