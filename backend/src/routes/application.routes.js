import express from "express"
import applicationController from "../controllers/application.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.js"
import { upload } from "../middlewares/upload.js"

const router = express.Router()

router.use(requireAuth)

router.post("/jobs/:jobId/apply", upload.single("resume"), applicationController.applyToJob)
router.get("/my-applications", applicationController.getMyApplications)
router.get("/:id", applicationController.getApplication)
router.patch("/:id/withdraw", applicationController.withdrawApplication)

router.get("/jobs/:jobId/applications", requireRole(["recruiter", "admin"]), applicationController.getJobApplications)
router.patch("/:id/status", requireRole(["recruiter", "admin"]), applicationController.updateApplicationStatus)
router.post("/:id/notes", requireRole(["recruiter", "admin"]), applicationController.addNote)
router.post("/:id/interviews", requireRole(["recruiter", "admin"]), applicationController.scheduleInterview)
router.get("/jobs/:jobId/analytics", requireRole(["recruiter", "admin"]), applicationController.getApplicationAnalytics)

export default router
