import express from "express"
import messageController from "../controllers/message.controller.js"
import { requireAuth } from "../middlewares/auth.js"
import { upload } from "../middlewares/upload.js"

const router = express.Router()

router.use(requireAuth)

router.get("/conversations", messageController.getConversations)
router.post("/conversations", messageController.createConversation)
router.patch("/conversations/:id/archive", messageController.archiveConversation)

router.get("/conversations/:id/messages", messageController.getMessages)
router.post("/conversations/:id/messages", messageController.sendMessage)
router.patch("/conversations/:id/read", messageController.markAsRead)
router.put("/messages/:id", messageController.editMessage)
router.delete("/messages/:id", messageController.deleteMessage)

router.post("/conversations/:id/upload", upload.single("file"), messageController.sendFileMessage)

export default router
