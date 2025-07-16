const Job = require("../models/Job.model")
const Application = require("../models/Application.model")
const { ApiError } = require("../utils/apiError")
const logger = require("../utils/logger")

class JobService {
  async getJobs(filters) {
    try {
      const { page, limit, search, location, type, experience, remote, salaryMin, salaryMax, skills, company, featured, sortBy, sortOrder } = filters

      const query = { status: "active" }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
        ]
      }

      if (location) {
        query.location = { $regex: location, $options: "i" }
      }

      if (type) {
        query.type = type
      }

      if (experience) {
        query.experience = experience
      }

      if (remote !== undefined) {
        query.remote = remote
      }

      if (salaryMin || salaryMax) {
        query.$and = query.$and || []
        if (salaryMin) {
          query.$and.push({ "salary.min": { $gte: salaryMin } })
        }
        if (salaryMax) {
          query.$and.push({ "salary.max": { $lte: salaryMax } })
        }
      }

      if (skills && skills.length > 0) {
        query.skills = { $in: skills }
      }

      if (company) {
        query.company = { $regex: company, $options: "i" }
      }

      if (featured !== undefined) {
        query.featured = featured
      }

      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

      const jobs = await Job.find(query)
        .populate("postedBy", "name company")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)

      const total = await Job.countDocuments(query)

      return {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Error getting jobs:", error)
      throw new ApiError(500, "Error retrieving jobs")
    }
  }

  async getJobById(jobId) {
    try {
      const job = await Job.findById(jobId).populate("postedBy", "name email profilePhoto company")
      return job
    } catch (error) {
      logger.error("Error getting job by ID:", error)
      throw new ApiError(500, "Error retrieving job")
    }
  }

  async createJob(jobData) {
    try {
      const job = new Job(jobData)
      await job.save()
      await job.populate("postedBy", "name company")

      logger.info(`New job created: ${job.title} by ${job.postedBy.name}`)
      return job
    } catch (error) {
      logger.error("Error creating job:", error)
      throw new ApiError(500, "Error creating job")
    }
  }

  async updateJob(jobId, updateData) {
    try {
      const job = await Job.findByIdAndUpdate(jobId, { $set: updateData }, { new: true, runValidators: true }).populate(
        "postedBy",
        "name company",
      )

      if (!job) {
        throw new ApiError(404, "Job not found")
      }

      logger.info(`Job updated: ${job.title}`)
      return job
    } catch (error) {
      logger.error("Error updating job:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error updating job")
    }
  }

  async deleteJob(jobId) {
    try {
      const job = await Job.findById(jobId)
      if (!job) {
        throw new ApiError(404, "Job not found")
      }

      await Application.deleteMany({ job: jobId })

      await Job.findByIdAndDelete(jobId)

      logger.info(`Job deleted: ${job.title}`)
    } catch (error) {
      logger.error("Error deleting job:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error deleting job")
    }
  }

  async getJobsByUser(userId, filters) {
    try {
      const { page, limit, status, sortBy, sortOrder } = filters
      const query = { postedBy: userId }

      if (status) {
        query.status = status
      }

      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

      const jobs = await Job.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)

      const total = await Job.countDocuments(query)

      return {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      logger.error("Error getting jobs by user:", error)
      throw new ApiError(500, "Error retrieving user jobs")
    }
  }

  async getJobStats(jobId) {
    try {
      const job = await Job.findById(jobId)
      if (!job) {
        throw new ApiError(404, "Job not found")
      }

      const applications = await Application.find({ job: jobId })

      const stats = {
        totalApplications: applications.length,
        applicationsByStatus: {
          applied: applications.filter((app) => app.status === "applied").length,
          reviewing: applications.filter((app) => app.status === "reviewing").length,
          shortlisted: applications.filter((app) => app.status === "shortlisted").length,
          interviewing: applications.filter((app) => app.status === "interviewing").length,
          offered: applications.filter((app) => app.status === "offered").length,
          hired: applications.filter((app) => app.status === "hired").length,
          rejected: applications.filter((app) => app.status === "rejected").length,
        },
        averageScore:
          applications.reduce((sum, app) => sum + (app.aiAnalysis?.score || 0), 0) / applications.length || 0,
        topSkills: this.getTopSkills(applications),
        viewsCount: job.viewsCount,
        applicationRate: job.viewsCount > 0 ? ((applications.length / job.viewsCount) * 100).toFixed(2) : 0,
      }

      return stats
    } catch (error) {
      logger.error("Error getting job stats:", error)
      throw new ApiError(500, "Error retrieving job statistics")
    }
  }

  async updateJobStatus(jobId, status) {
    try {
      const job = await Job.findByIdAndUpdate(jobId, { status }, { new: true }).populate("postedBy", "name company")

      if (!job) {
        throw new ApiError(404, "Job not found")
      }

      logger.info(`Job status updated: ${job.title} - ${status}`)
      return job
    } catch (error) {
      logger.error("Error updating job status:", error)
      throw new ApiError(500, "Error updating job status")
    }
  }

  async getSimilarJobs(jobId, limit = 5) {
    try {
      const job = await Job.findById(jobId)
      if (!job) {
        throw new ApiError(404, "Job not found")
      }

      const similarJobs = await Job.find({
        _id: { $ne: jobId },
        status: "active",
        $or: [
          { skills: { $in: job.skills } },
          { type: job.type },
          { experience: job.experience },
          { location: { $regex: job.location, $options: "i" } },
        ],
      })
        .populate("postedBy", "name company")
        .limit(limit)
        .sort({ createdAt: -1 })

      return similarJobs
    } catch (error) {
      logger.error("Error getting similar jobs:", error)
      throw new ApiError(500, "Error retrieving similar jobs")
    }
  }

  getTopSkills(applications) {
    const skillsCount = {}

    applications.forEach((app) => {
      if (app.aiAnalysis && app.aiAnalysis.skills) {
        app.aiAnalysis.skills.forEach((skill) => {
          skillsCount[skill] = (skillsCount[skill] || 0) + 1
        })
      }
    })

    return Object.entries(skillsCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))
  }
}

module.exports = new JobService()