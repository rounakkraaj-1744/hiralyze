import express from "express"
import userController from "../controllers/user.controller"
import { requireAuth } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = express.Router()

router.use(requireAuth)

router.get("/profile/:id?", userController.getProfile)
router.put("/profile", userController.updateProfile)
router.put("/settings", userController.updateSettings)
router.post("/profile/photo", upload.single("photo"), userController.uploadProfilePhoto)

router.get("/stats", userController.getStats)
router.get("/search", userController.searchUsers)
router.post("/deactivate", userController.deactivateAccount)
router.delete("/delete", userController.deleteAccount)

module.exports = router