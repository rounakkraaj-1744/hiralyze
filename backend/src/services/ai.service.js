import axios from "axios"
import applicationService from "./application.service.js"
import jobService from "./job.service.js"
import logger from "../utils/logger.js"

class AIService {
  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000"
  }

  async processResumeAsync(applicationId, resumePath, jobId) {
    try {
      const job = await jobService.getJobById(jobId)
      if (!job) {
        throw new Error("Job not found")
      }

      const requestData = {
        resume_path: resumePath,
        job_description: job.description,
        job_requirements: job.requirements || [],
      }

      const response = await axios.post(`${this.aiServiceUrl}/process-resume`, requestData, {
        timeout: 60000, // 60 seconds timeout
      })

      const aiAnalysis = {
        summary: response.data.summary,
        score: response.data.score,
        skills: response.data.skills,
        experience: response.data.experience,
        strengths: response.data.strengths,
        weaknesses: response.data.weaknesses,
        recommendations: response.data.recommendations,
        skillsMatch: response.data.skills_match || 0,
        experienceMatch: response.data.experience_match || 0,
        overallMatch: response.data.overall_score || response.data.score,
      }

      // Update application with AI analysis
      await applicationService.updateAIAnalysis(applicationId, aiAnalysis)

      logger.info(`Resume processed successfully for application: ${applicationId}`)
      return aiAnalysis
    }
    catch (error) {
      logger.error(`Error processing resume for application ${applicationId}:`, error.message)

      // Update application with error status
      try {
        await applicationService.updateAIAnalysis(applicationId, {
          summary: "Resume processing failed",
          score: 0,
          skills: [],
          experience: "Unable to analyze",
          strengths: [],
          weaknesses: ["Resume processing failed"],
          recommendations: ["Please try uploading your resume again"],
          processedAt: new Date(),
          error: error.message,
        })
      }
      catch (updateError) {
        logger.error("Error updating application with AI error:", updateError)
      }

      throw error
    }
  }

  async processResume(resumePath, jobDescription, jobRequirements) {
    try {
      const requestData = {
        resume_path: resumePath,
        job_description: jobDescription,
        job_requirements: jobRequirements || [],
      }

      const response = await axios.post(`${this.aiServiceUrl}/process-resume`, requestData, {
        timeout: 60000,
      })

      return response.data
    } catch (error) {
      logger.error("Error processing resume:", error.message)
      throw error
    }
  }

  async uploadResume(file) {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post(`${this.aiServiceUrl}/upload-resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      })

      return response.data
    } catch (error) {
      logger.error("Error uploading resume to AI service:", error.message)
      throw error
    }
  }

  async getAIServiceHealth() {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/health`, {
        timeout: 5000,
      })
      return response.data
    } catch (error) {
      logger.error("AI service health check failed:", error.message)
      return { status: "unhealthy", error: error.message }
    }
  }
}

export default new AIService()
