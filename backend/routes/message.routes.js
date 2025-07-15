import express from "express"
import messageController from "../controllers/message.controller"
import { requireAuth } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = express.Router()

// All routes require authentication
router.use(requireAuth)

// Conversation routes
router.get("/conversations", messageController.getConversations)
router.post("/conversations", messageController.createConversation)
router.patch("/conversations/:id/archive", messageController.archiveConversation)

// Message routes
router.get("/conversations/:id/messages", messageController.getMessages)
router.post("/conversations/:id/messages", messageController.sendMessage)
router.patch("/conversations/:id/read", messageController.markAsRead)
router.put("/messages/:id", messageController.editMessage)
router.delete("/messages/:id", messageController.deleteMessage)

// File upload for messages
router.post("/conversations/:id/upload", upload.single("file"), messageController.sendFileMessage)

module.exports = router
