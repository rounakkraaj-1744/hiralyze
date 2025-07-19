import express from "express"
import authController from "../controllers/auth.controller.js"
import { requireAuth } from "../middlewares/auth.js"
import { validateRegistration, validateLogin } from "../validators/auth.validator.js"

const router = express.Router()

router.get("/google", authController.googleAuth)
router.get("/google/callback", authController.googleCallback)
router.get("/linkedin", authController.linkedinAuth)
router.get("/linkedin/callback", authController.linkedinCallback)

router.post("/register", validateRegistration, authController.register)
router.post("/login", validateLogin, authController.login)
router.post("/logout", authController.logout)

router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)
router.post("/change-password", requireAuth, authController.changePassword)

router.get("/me", requireAuth, authController.getCurrentUser)

export default router