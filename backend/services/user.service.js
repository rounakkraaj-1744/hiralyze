const User = require("../models/User.model")
const Application = require("../models/Application.model")
const Job = require("../models/Job.model")
const { ApiError } = require("../utils/apiError")
const logger = require("../utils/logger")

class UserService {
  async findById(userId) {
    try {
      const user = await User.findById(userId).select("-password")
      return user
    } catch (error) {
      logger.error("Error finding user by ID:", error)
      throw new ApiError(500, "Error retrieving user")
    }
  }

  async findByEmail(email) {
    try {
      const user = await User.findOne({ email }).select("-password")
      return user
    } catch (error) {
      logger.error("Error finding user by email:", error)
      throw new ApiError(500, "Error retrieving user")
    }
  }

  async findOrCreateUser(userData, provider) {
    try {
      let user

      if (provider === "google") {
        user = await User.findOne({ googleId: userData.googleId })
      } else if (provider === "linkedin") {
        user = await User.findOne({ linkedinId: userData.linkedinId })
      }

      if (user) {
        user.name = userData.name
        user.profilePhoto = userData.profilePhoto
        user.lastLogin = new Date()
        await user.save()
        return user
      }

      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        if (provider === "google") {
          existingUser.googleId = userData.googleId
        } else if (provider === "linkedin") {
          existingUser.linkedinId = userData.linkedinId
        }
        existingUser.profilePhoto = userData.profilePhoto
        existingUser.lastLogin = new Date()
        await existingUser.save()
        return existingUser
      }

      user = new User(userData)
      await user.save()

      logger.info(`New user created via ${provider}:`, user.email)
      return user
    } catch (error) {
      logger.error(`Error in findOrCreateUser (${provider}):`, error)
      throw new ApiError(500, "Error creating/finding user")
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const allowedUpdates = [
        "name",
        "profile.phone",
        "profile.location",
        "profile.title",
        "profile.bio",
        "profile.experience",
        "profile.education",
        "profile.skills",
        "profile.linkedin",
        "profile.github",
        "profile.website",
        "profile.company",
        "profile.department",
      ]

      const updateObject = {}

      // Handle nested profile updates
      Object.keys(updateData).forEach((key) => {
        if (key === "profile" && typeof updateData[key] === "object") {
          Object.keys(updateData[key]).forEach((profileKey) => {
            if (allowedUpdates.includes(`profile.${profileKey}`)) {
              updateObject[`profile.${profileKey}`] = updateData[key][profileKey]
            }
          })
        } else if (allowedUpdates.includes(key)) {
          updateObject[key] = updateData[key]
        }
      })

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateObject },
        { new: true, runValidators: true },
      ).select("-password")

      if (!user) {
        throw new ApiError(404, "User not found")
      }

      logger.info(`User profile updated: ${user.email}`)
      return user
    } catch (error) {
      logger.error("Error updating user profile:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error updating profile")
    }
  }

  async updateSettings(userId, settings) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { settings } },
        { new: true, runValidators: true },
      ).select("-password")

      if (!user) {
        throw new ApiError(404, "User not found")
      }

      return user
    } catch (error) {
      logger.error("Error updating user settings:", error)
      throw new ApiError(500, "Error updating settings")
    }
  }

  async updateProfilePhoto(userId, photoPath) {
    try {
      const user = await User.findByIdAndUpdate(userId, { profilePhoto: photoPath }, { new: true }).select("-password")

      if (!user) {
        throw new ApiError(404, "User not found")
      }

      return user
    } catch (error) {
      logger.error("Error updating profile photo:", error)
      throw new ApiError(500, "Error updating profile photo")
    }
  }

  async getUserStats(userId) {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new ApiError(404, "User not found")
      }

      let stats = {}

      if (user.role === "candidate") {
        const applications = await Application.find({ candidate: userId })
        stats = {
          totalApplications: applications.length,
          pendingApplications: applications.filter((app) => app.status === "applied").length,
          interviewingApplications: applications.filter((app) => app.status === "interviewing").length,
          offeredApplications: applications.filter((app) => app.status === "offered").length,
          rejectedApplications: applications.filter((app) => app.status === "rejected").length,
          averageScore:
            applications.reduce((sum, app) => sum + (app.aiAnalysis?.score || 0), 0) / applications.length || 0,
        }
      } else if (user.role === "recruiter") {
        const jobs = await Job.find({ postedBy: userId })
        const totalApplications = await Application.countDocuments({
          job: { $in: jobs.map((job) => job._id) },
        })

        stats = {
          totalJobs: jobs.length,
          activeJobs: jobs.filter((job) => job.status === "active").length,
          totalApplications,
          totalViews: jobs.reduce((sum, job) => sum + job.viewsCount, 0),
        }
      }

      return stats
    } catch (error) {
      logger.error("Error getting user stats:", error)
      throw new ApiError(500, "Error retrieving user statistics")
    }
  }

  async searchUsers(filters) {
    try {
      const { query, role, page, limit } = filters
      const searchQuery = {}

      if (query) {
        searchQuery.$or = [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { "profile.title": { $regex: query, $options: "i" } },
          { "profile.skills": { $in: [new RegExp(query, "i")] } },
        ]
      }

      if (role) {
        searchQuery.role = role
      }

      searchQuery.isActive = true

      const users = await User.find(searchQuery)
        .select("-password")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })

      const total = await User.countDocuments(searchQuery)

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Error searching users:", error)
      throw new ApiError(500, "Error searching users")
    }
  }

  async deactivateAccount(userId) {
    try {
      const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true })

      if (!user) {
        throw new ApiError(404, "User not found")
      }

      logger.info(`User account deactivated: ${user.email}`)
      return user
    } catch (error) {
      logger.error("Error deactivating account:", error)
      throw new ApiError(500, "Error deactivating account")
    }
  }

  async deleteAccount(userId, password) {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new ApiError(404, "User not found")
      }

      if (user.password && !(await user.comparePassword(password))) {
        throw new ApiError(400, "Invalid password")
      }

      await Application.deleteMany({ candidate: userId })

      await Job.deleteMany({ postedBy: userId })

      await User.findByIdAndDelete(userId)

      logger.info(`User account deleted: ${user.email}`)
    } catch (error) {
      logger.error("Error deleting account:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error deleting account")
    }
  }
}

module.exports = new UserService()
