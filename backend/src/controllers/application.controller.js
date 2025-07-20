import applicationService from"../services/application.service.js"
import aiService from"../services/ai.service.js"
import s3Service from"../services/s3.service.js"
import jobService from"../services/job.service.js"
import { ApiResponse } from"../utils/apiResponse.js"
import { ApiError } from"../utils/apiError.js"
import { asyncHandler } from"../utils/asyncHandler.js"

class ApplicationController {
  applyToJob = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId
    const candidateId = req.user.id

    if (!req.file) {
      throw new ApiError(400, "Resume file is required")
    }

    try {
      const s3Upload = await s3Service.uploadFile(req.file, "resumes")

      const applicationData = {
        job: jobId,
        candidate: candidateId,
        resume: {
          s3Key: s3Upload.key,
          s3Url: s3Upload.url,
          bucket: s3Upload.bucket,
          filename: s3Upload.key.split("/").pop(),
          originalName: s3Upload.originalName,
          size: s3Upload.size,
          mimetype: s3Upload.mimetype,
          uploadedAt: new Date(),
        },
        coverLetter: req.body.coverLetter,
      }

      const application = await applicationService.createApplication(applicationData)

      aiService.processResumeAsync(application._id, s3Upload.key, jobId).catch((error) => {
        console.error("AI processing error:", error)
      })

      res.status(201).json(new ApiResponse(201, { application }, "Application submitted successfully"))
    }
    catch (error) {
      throw error
    }
  })

  downloadResume = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const application = await applicationService.getApplicationById(applicationId)

    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    const isCandidate = application.candidate._id.toString() === req.user.id
    const isRecruiter = application.job.postedBy.toString() === req.user.id

    if (!isCandidate && !isRecruiter) {
      throw new ApiError(403, "Not authorized to download this resume")
    }

    if (!application.resume || !application.resume.s3Key) {
      throw new ApiError(404, "Resume not found")
    }

    try {
      const signedUrl = await s3Service.getSignedUrl(application.resume.s3Key, 300) // 5 minutes expiry

      res.json(
        new ApiResponse(
          200,
          {
            downloadUrl: signedUrl,
            filename: application.resume.originalName,
            size: application.resume.size,
          },
          "Resume download URL generated",
        ),
      )
    } catch (error) {
      throw new ApiError(500, "Failed to generate download URL")
    }
  })

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

    const job = await jobService.getJobById(jobId)

    if (!job) {
      throw new ApiError(404, "Job not found")
    }

    if (job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to view applications for this job")
    }

    const result = await applicationService.getApplicationsByJob(jobId, filters)

    for (const application of result.applications) {
      if (application.resume && application.resume.s3Key) {
        try {
          application.resume.downloadUrl = await s3Service.getSignedUrl(application.resume.s3Key, 3600)
        }
        catch (error) {
          console.error("Error generating signed URL:", error)
          application.resume.downloadUrl = null
        }
      }
    }

    res.json(new ApiResponse(200, result, "Applications retrieved successfully"))
  })

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

    for (const application of result.applications) {
      if (application.resume && application.resume.s3Key) {
        try {
          application.resume.downloadUrl = await s3Service.getSignedUrl(application.resume.s3Key, 3600)
        }
        catch (error) {
          console.error("Error generating signed URL:", error)
          application.resume.downloadUrl = null
        }
      }
    }
    res.json(new ApiResponse(200, result, "My applications retrieved successfully"))
  })

  getApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const application = await applicationService.getApplicationById(applicationId)

    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    const isCandidate = application.candidate._id.toString() === req.user.id
    const isRecruiter = application.job.postedBy.toString() === req.user.id

    if (!isCandidate && !isRecruiter) {
      throw new ApiError(403, "Not authorized to view this application")
    }

    // Generate signed URL for resume if exists
    if (application.resume && application.resume.s3Key) {
      try {
        application.resume.downloadUrl = await s3Service.getSignedUrl(application.resume.s3Key, 3600)
      } catch (error) {
        console.error("Error generating signed URL:", error)
        application.resume.downloadUrl = null
      }
    }

    res.json(new ApiResponse(200, { application }, "Application retrieved successfully"))
  })

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

  withdrawApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const { reason } = req.body

    const application = await applicationService.getApplicationById(applicationId)
    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    if (application.candidate._id.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to withdraw this application")
    }

    const updatedApplication = await applicationService.withdrawApplication(applicationId, reason)

    res.json(new ApiResponse(200, { application: updatedApplication }, "Application withdrawn successfully"))
  })

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

    if (application.job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to add notes to this application")
    }

    const updatedApplication = await applicationService.addNote(applicationId, content, req.user.id)

    res.json(new ApiResponse(200, { application: updatedApplication }, "Note added successfully"))
  })

  scheduleInterview = asyncHandler(async (req, res) => {
    const applicationId = req.params.id
    const interviewData = req.body

    const application = await applicationService.getApplicationById(applicationId)
    if (!application) {
      throw new ApiError(404, "Application not found")
    }

    if (application.job.postedBy.toString() !== req.user.id) {
      throw new ApiError(403, "Not authorized to schedule interview for this application")
    }

    const updatedApplication = await applicationService.scheduleInterview(applicationId, {
      ...interviewData,
      interviewer: req.user.id,
    })

    res.json(new ApiResponse(200, { application: updatedApplication }, "Interview scheduled successfully"))
  })

  getApplicationAnalytics = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId

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