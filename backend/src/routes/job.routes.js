import express from "express"
import jobController from "../controllers/job.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.js"

const router = express.Router()

router.get("/", jobController.getJobs)
router.get("/:id", jobController.getJob)
router.get("/:id/similar", jobController.getSimilarJobs)

router.use(requireAuth)

router.post("/", requireRole(["recruiter", "admin"]), jobController.createJob)
router.put("/:id", requireRole(["recruiter", "admin"]), jobController.updateJob)
router.delete("/:id", requireRole(["recruiter", "admin"]), jobController.deleteJob)
router.patch("/:id/status", requireRole(["recruiter", "admin"]), jobController.toggleJobStatus)

router.get("/my/jobs", requireRole(["recruiter", "admin"]), jobController.getMyJobs)
router.get("/:id/stats", requireRole(["recruiter", "admin"]), jobController.getJobStats)

export default router