import applicationService from "../services/application.service.js"
import aiService from "../services/ai.service.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

class ApplicationController {
  // Apply to job
  applyToJob = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId
    const candidateId = req.user.id

    if (!req.file) {
      throw new ApiError(400, "Resume file is required")
    }

    const applicationData = {
      job: jobId,
      candidate: candidateId,
      resume: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      coverLetter: req.body.coverLetter,
    }

    const application = await applicationService.createApplication(applicationData)

    // Process resume with AI in background
    aiService.processResumeAsync(application._id, req.file.path, jobId).catch((error) => {
      console.error("AI processing error:", error)
    })

    res.status(201).json(new ApiResponse(201, { application }, "Application submitted successfully"))
  })

  // Get applications for a job (recruiter)
  getJobApplications = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId
    const filters = {
      page: Number.parseInt(req.query.page) || 1,
      limit: Number.parseInt(req.query.limit) || 10,
      status: req.query.status,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc",
      minScore: req.query.minScore ? Number.parseInt(req.query.minScore) : undefined,
    }

    // Check if user owns the job
    const jobService = (await import("../services/job.service.js")).default
    const job = await jobService.getJobById(jobId)

    if (!job) {
      throw new ApiError(404, "Job not found")
    }

    if (job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to view applications for this job")
    }

    const result = await applicationService.getApplicationsByJob(jobId, filters)

    res.json(new ApiResponse(200, result, "Applications retrieved successfully"))
  })

  // Get user's applications (candidate)
  getMyApplications = asyncHandler(async (req, res) => {
    const candidateId = req.user.id
    const filters = {
      page: Number.parseInt(req.query.page) || 1,
      limit: Number.parseInt(req.query.limit) || 10,
      status: req.query.status,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc",
    }

    const result = await applicationService.getApplicationsByCandidate(candidateId, filters)

    res.json(new ApiResponse(200, result, "My applications retrieved successfully"))
  })

  // Get single application
  getApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const application = await applicationService.getApplicationById(applicationId)

    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    // Check authorization
    const isCandidate = application.candidate._id.toString() === req.user.id
    const isRecruiter = application.job.postedBy.toString() === req.user.id

    if (!isCandidate && !isRecruiter) {
      throw new ApiError(403, "Not authorized to view this application")
    }

    res.json(new ApiResponse(200, { application }, "Application retrieved successfully"))
  })

  // Update application status (recruiter)
  updateApplicationStatus = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const { status, note } = req.body

    const validStatuses = ["reviewing", "shortlisted", "interviewing", "offered", "hired", "rejected"]
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status")
    }

    const application = await applicationService.getApplicationById(applicationId)
    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    // Check if user owns the job
    if (application.job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to update this application")
    }

    const updatedApplication = await applicationService.updateApplicationStatus(
      applicationId,
      status,
      req.user.id,
      note,
    )

    res.json(new ApiResponse(200, { application: updatedApplication }, "Application status updated successfully"))
  })

  // Withdraw application (candidate)
  withdrawApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const { reason } = req.body

    const application = await applicationService.getApplicationById(applicationId)
    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    // Check if user owns the application
    if (application.candidate._id.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to withdraw this application")
    }

    const updatedApplication = await applicationService.withdrawApplication(applicationId, reason)

    res.json(new ApiResponse(200, { application: updatedApplication }, "Application withdrawn successfully"))
  })

  // Add note to application (recruiter)
  addNote = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const { content } = req.body

    if (!content) {
      throw new ApiError(400, "Note content is required")
    }

    const application = await applicationService.getApplicationById(applicationId)
    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    // Check if user owns the job
    if (application.job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to add notes to this application")
    }

    const updatedApplication = await applicationService.addNote(applicationId, content, req.user.id)

    res.json(new ApiResponse(200, { application: updatedApplication }, "Note added successfully"))
  })

  // Schedule interview
  scheduleInterview = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const interviewData = req.body

    const application = await applicationService.getApplicationById(applicationId)
    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    // Check if user owns the job
    if (application.job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to schedule interview for this application")
    }

    const updatedApplication = await applicationService.scheduleInterview(applicationId, {
      ...interviewData,
      interviewer: req.user.id,
    })

    res.json(new ApiResponse(200, { application: updatedApplication }, "Interview scheduled successfully"))
  })

  // Get application analytics (recruiter)
  getApplicationAnalytics = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId

    // Check if user owns the job
    const jobService = (await import("../services/job.service.js")).default
    const job = await jobService.getJobById(jobId)

    if (!job) {
      throw new ApiError(404, "Job not found")
    }

    if (job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to view analytics for this job")
    }

    const analytics = await applicationService.getApplicationAnalytics(jobId)

    res.json(new ApiResponse(200, { analytics }, "Application analytics retrieved successfully"))
  })
}

export default new ApplicationController()