const Application = require("../models/Application.model")
const Job = require("../models/Job.model")
const { ApiError } = require("../utils/apiError")
const logger = require("../utils/logger")

class ApplicationService {
  async createApplication(applicationData) {
    try {
      const existingApplication = await Application.findOne({
        job: applicationData.job,
        candidate: applicationData.candidate,
      })

      if (existingApplication) {
        throw new ApiError(400, "You have already applied to this job")
      }

      const application = new Application(applicationData)
      await application.save()

      // Update job applications count
      const job = await Job.findById(applicationData.job)
      if (job) {
        await job.updateApplicationsCount()
      }

      await application.populate([
        { path: "candidate", select: "name email profilePhoto profile" },
        { path: "job", select: "title company location", populate: { path: "postedBy", select: "name email" } },
      ])

      logger.info(`New application created: ${application.candidate.name} applied to ${application.job.title}`)
      return application
    } catch (error) {
      logger.error("Error creating application:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error creating application")
    }
  }

  async getApplicationsByJob(jobId, filters) {
    try {
      const { page, limit, status, sortBy, sortOrder, minScore } = filters
      const query = { job: jobId }

      if (status) {
        query.status = status
      }

      if (minScore) {
        query["aiAnalysis.score"] = { $gte: minScore }
      }

      const sortOptions = {}
      if (sortBy === "score") {
        sortOptions["aiAnalysis.score"] = sortOrder === "asc" ? 1 : -1
      } else {
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1
      }

      const applications = await Application.find(query)
        .populate("candidate", "name email profilePhoto profile")
        .populate("job", "title company")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)

      const total = await Application.countDocuments(query)

      return {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Error getting applications by job:", error)
      throw new ApiError(500, "Error retrieving applications")
    }
  }

  async getApplicationsByCandidate(candidateId, filters) {
    try {
      const { page, limit, status, sortBy, sortOrder } = filters
      const query = { candidate: candidateId }

      if (status) {
        query.status = status
      }

      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

      const applications = await Application.find(query)
        .populate("job", "title company location type experience salary")
        .populate("job.postedBy", "name company")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)

      const total = await Application.countDocuments(query)

      return {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Error getting applications by candidate:", error)
      throw new ApiError(500, "Error retrieving applications")
    }
  }

  async getApplicationById(applicationId) {
    try {
      const application = await Application.findById(applicationId)
        .populate("candidate", "name email profilePhoto profile")
        .populate("job", "title company location description requirements", {
          populate: { path: "postedBy", select: "name email company" },
        })

      return application
    } catch (error) {
      logger.error("Error getting application by ID:", error)
      throw new ApiError(500, "Error retrieving application")
    }
  }

  async updateApplicationStatus(applicationId, status, updatedBy, note) {
    try {
      const application = await Application.findById(applicationId)
      if (!application) {
        throw new ApiError(404, "Application not found")
      }

      application.status = status

      // Add to timeline
      application.timeline.push({
        status,
        date: new Date(),
        note,
        updatedBy,
      })

      await application.save()
      await application.populate([
        { path: "candidate", select: "name email profilePhoto" },
        { path: "job", select: "title company" },
      ])

      logger.info(`Application status updated: ${applicationId} - ${status}`)
      return application
    } catch (error) {
      logger.error("Error updating application status:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error updating application status")
    }
  }

  async withdrawApplication(applicationId, reason) {
    try {
      const application = await Application.findById(applicationId)
      if (!application) {
        throw new ApiError(404, "Application not found")
      }

      if (application.status === "withdrawn") {
        throw new ApiError(400, "Application already withdrawn")
      }

      application.status = "withdrawn"
      application.withdrawnAt = new Date()
      application.withdrawnReason = reason

      await application.save()
      await application.populate([
        { path: "candidate", select: "name email" },
        { path: "job", select: "title company" },
      ])

      logger.info(`Application withdrawn: ${applicationId}`)
      return application
    } catch (error) {
      logger.error("Error withdrawing application:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error withdrawing application")
    }
  }

  async addNote(applicationId, content, authorId) {
    try {
      const application = await Application.findById(applicationId)
      if (!application) {
        throw new ApiError(404, "Application not found")
      }

      application.notes.push({
        content,
        author: authorId,
        createdAt: new Date(),
      })

      await application.save()
      await application.populate("notes.author", "name")

      return application
    } catch (error) {
      logger.error("Error adding note to application:", error)
      throw new ApiError(500, "Error adding note")
    }
  }

  async scheduleInterview(applicationId, interviewData) {
    try {
      const application = await Application.findById(applicationId)
      if (!application) {
        throw new ApiError(404, "Application not found")
      }

      application.interviews.push(interviewData)

      // Update status to interviewing if not already
      if (application.status === "applied" || application.status === "reviewing") {
        application.status = "interviewing"
      }

      await application.save()
      await application.populate("interviews.interviewer", "name email")

      logger.info(`Interview scheduled for application: ${applicationId}`)
      return application
    } catch (error) {
      logger.error("Error scheduling interview:", error)
      throw new ApiError(500, "Error scheduling interview")
    }
  }

  async getApplicationAnalytics(jobId) {
    try {
      const applications = await Application.find({ job: jobId })

      const analytics = {
        total: applications.length,
        byStatus: {},
        byScore: {
          excellent: 0, // 80-100
          good: 0, // 60-79
          average: 0, // 40-59
          poor: 0, // 0-39
        },
        averageScore: 0,
        topSkills: {},
        applicationTrend: [],
      }

      // Count by status
      applications.forEach((app) => {
        analytics.byStatus[app.status] = (analytics.byStatus[app.status] || 0) + 1

        const score = app.aiAnalysis?.score || 0
        if (score >= 80) analytics.byScore.excellent++
        else if (score >= 60) analytics.byScore.good++
        else if (score >= 40) analytics.byScore.average++
        else analytics.byScore.poor++

        if (app.aiAnalysis?.skills) {
          app.aiAnalysis.skills.forEach((skill) => {
            analytics.topSkills[skill] = (analytics.topSkills[skill] || 0) + 1
          })
        }
      })

      const totalScore = applications.reduce((sum, app) => sum + (app.aiAnalysis?.score || 0), 0)
      analytics.averageScore = applications.length > 0 ? totalScore / applications.length : 0

      analytics.topSkills = Object.entries(analytics.topSkills)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }))

      return analytics
    } catch (error) {
      logger.error("Error getting application analytics:", error)
      throw new ApiError(500, "Error retrieving application analytics")
    }
  }

  async updateAIAnalysis(applicationId, aiAnalysis) {
    try {
      const application = await Application.findByIdAndUpdate(
        applicationId,
        {
          aiAnalysis: {
            ...aiAnalysis,
            processedAt: new Date(),
          },
        },
        { new: true },
      )

      if (!application) {
        throw new ApiError(404, "Application not found")
      }

      logger.info(`AI analysis updated for application: ${applicationId}`)
      return application
    } catch (error) {
      logger.error("Error updating AI analysis:", error)
      throw new ApiError(500, "Error updating AI analysis")
    }
  }
}

module.exports = new ApplicationService()
