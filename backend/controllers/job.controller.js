const jobService = require("../services/job.service")
const { ApiResponse } = require("../utils/apiResponse")
const { ApiError } = require("../utils/apiError")
const { asyncHandler } = require("../utils/asyncHandler")
const { validateJobData } = require("../validators/job.validator")

class JobController {
  // Get all jobs with filters
  getJobs = asyncHandler(async (req, res) => {
    const filters = {
      page: Number.parseInt(req.query.page) || 1,
      limit: Number.parseInt(req.query.limit) || 10,
      search: req.query.search,
      location: req.query.location,
      type: req.query.type,
      experience: req.query.experience,
      remote: req.query.remote === "true",
      salaryMin: req.query.salaryMin ? Number.parseInt(req.query.salaryMin) : undefined,
      salaryMax: req.query.salaryMax ? Number.parseInt(req.query.salaryMax) : undefined,
      skills: req.query.skills ? req.query.skills.split(",") : undefined,
      company: req.query.company,
      featured: req.query.featured === "true",
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc",
    }

    const result = await jobService.getJobs(filters)

    res.json(new ApiResponse(200, result, "Jobs retrieved successfully"))
  })

  // Get single job
  getJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const job = await jobService.getJobById(jobId)

    if (!job) {
      throw new ApiError(404, "Job not found")
    }

    // Increment view count if user is not the job poster
    if (!req.user || job.postedBy.toString() !== req.user.id) {
      await job.incrementViews()
    }

    res.json(new ApiResponse(200, { job }, "Job retrieved successfully"))
  })

  // Create new job
  createJob = asyncHandler(async (req, res) => {
    const { error } = validateJobData(req.body)
    if (error) {
      throw new ApiError(400, error.details[0].message)
    }

    const jobData = {
      ...req.body,
      postedBy: req.user.id,
    }

    const job = await jobService.createJob(jobData)

    res.status(201).json(new ApiResponse(201, { job }, "Job created successfully"))
  })

  // Update job
  updateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const updateData = req.body

    // Check if user owns the job
    const existingJob = await jobService.getJobById(jobId)
    if (!existingJob) {
      throw new ApiError(404, "Job not found")
    }

    if (existingJob.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to update this job")
    }

    const job = await jobService.updateJob(jobId, updateData)

    res.json(new ApiResponse(200, { job }, "Job updated successfully"))
  })

  // Delete job
  deleteJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id

    // Check if user owns the job
    const existingJob = await jobService.getJobById(jobId)
    if (!existingJob) {
      throw new ApiError(404, "Job not found")
    }

    if (existingJob.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to delete this job")
    }

    await jobService.deleteJob(jobId)

    res.json(new ApiResponse(200, null, "Job deleted successfully"))
  })

  // Get jobs posted by current user
  getMyJobs = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const filters = {
      page: Number.parseInt(req.query.page) || 1,
      limit: Number.parseInt(req.query.limit) || 10,
      status: req.query.status,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc",
    }

    const result = await jobService.getJobsByUser(userId, filters)

    res.json(new ApiResponse(200, result, "My jobs retrieved successfully"))
  })

  // Get job statistics
  getJobStats = asyncHandler(async (req, res) => {
    const jobId = req.params.id

    // Check if user owns the job
    const job = await jobService.getJobById(jobId)
    if (!job) {
      throw new ApiError(404, "Job not found")
    }

    if (job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to view job statistics")
    }

    const stats = await jobService.getJobStats(jobId)

    res.json(new ApiResponse(200, { stats }, "Job statistics retrieved successfully"))
  })

  // Toggle job status
  toggleJobStatus = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const { status } = req.body

    if (!["active", "paused", "closed"].includes(status)) {
      throw new ApiError(400, "Invalid status")
    }

    // Check if user owns the job
    const job = await jobService.getJobById(jobId)
    if (!job) {
      throw new ApiError(404, "Job not found")
    }

    if (job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to update job status")
    }

    const updatedJob = await jobService.updateJobStatus(jobId, status)

    res.json(new ApiResponse(200, { job: updatedJob }, "Job status updated successfully"))
  })

  // Get similar jobs
  getSimilarJobs = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const limit = Number.parseInt(req.query.limit) || 5

    const jobs = await jobService.getSimilarJobs(jobId, limit)

    res.json(new ApiResponse(200, { jobs }, "Similar jobs retrieved successfully"))
  })
}

module.exports = new JobController()
