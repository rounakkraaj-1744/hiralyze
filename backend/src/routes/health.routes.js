import express from "express"
import aiService from "../services/ai.service.js"

const router = express.Router()

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    // Check AI service health
    const aiHealth = await aiService.getAIServiceHealth()
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        backend: "healthy",
        ai: aiHealth.status
      },
      version: "1.0.0"
    })
  } catch (error) {
    res.status(200).json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      services: {
        backend: "healthy",
        ai: "unhealthy"
      },
      version: "1.0.0",
      error: error.message
    })
  }
})

export default router 