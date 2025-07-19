import messageService from "../services/message.service.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

class MessageController {
  getConversations = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20

    const conversations = await messageService.getConversationsByUser(userId, page, limit)

    res.json(new ApiResponse(200, { conversations }, "Conversations retrieved successfully"))
  })

  // Create new conversation
  createConversation = asyncHandler(async (req, res) => {
    const { participantId, jobId, applicationId } = req.body
    const userId = req.user.id

    if (!participantId) {
      throw new ApiError(400, "Participant ID is required")
    }

    const conversation = await messageService.createConversation([userId, participantId], jobId, applicationId)

    res.status(201).json(new ApiResponse(201, { conversation }, "Conversation created successfully"))
  })

  // Get messages in conversation
  getMessages = asyncHandler(async (req, res) => {
    const conversationId = req.params.id
    const userId = req.user.id
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50

    // Verify user is participant
    const Conversation = require("../models/Conversation.model.js")
    const conversation = await Conversation.findById(conversationId)

    if (!conversation || !conversation.participants.includes(userId)) {
      throw new ApiError(403, "Not authorized to view this conversation")
    }

    const messages = await messageService.getMessagesByConversation(conversationId, page, limit)

    res.json(new ApiResponse(200, { messages }, "Messages retrieved successfully"))
  })

  // Send message
  sendMessage = asyncHandler(async (req, res) => {
    const conversationId = req.params.id
    const { content } = req.body
    const userId = req.user.id

    if (!content || content.trim().length === 0) {
      throw new ApiError(400, "Message content is required")
    }

    // Verify user is participant
    const Conversation = require("../models/Conversation.model.js")
    const conversation = await Conversation.findById(conversationId)

    if (!conversation || !conversation.participants.includes(userId)) {
      throw new ApiError(403, "Not authorized to send messages in this conversation")
    }

    const message = await messageService.createMessage({
      conversation: conversationId,
      sender: userId,
      content: content.trim(),
    })

    // Emit to socket
    req.app.get("io").to(conversationId).emit("new-message", message)

    res.status(201).json(new ApiResponse(201, { message }, "Message sent successfully"))
  })

  // Send file message
  sendFileMessage = asyncHandler(async (req, res) => {
    const conversationId = req.params.id
    const userId = req.user.id

    if (!req.file) {
      throw new ApiError(400, "File is required")
    }

    // Verify user is participant
    const Conversation = require("../models/Conversation.model.js")
    const conversation = await Conversation.findById(conversationId)

    if (!conversation || !conversation.participants.includes(userId)) {
      throw new ApiError(403, "Not authorized to send files in this conversation")
    }

    const message = await messageService.createMessage({
      conversation: conversationId,
      sender: userId,
      content: req.body.content || "File attachment",
      type: "file",
      attachment: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    })

    // Emit to socket
    req.app.get("io").to(conversationId).emit("new-message", message)

    res.status(201).json(new ApiResponse(201, { message }, "File sent successfully"))
  })

  // Mark messages as read
  markAsRead = asyncHandler(async (req, res) => {
    const conversationId = req.params.id
    const userId = req.user.id

    // Verify user is participant
    const Conversation = require("../models/Conversation.model.js")
    const conversation = await Conversation.findById(conversationId)

    if (!conversation || !conversation.participants.includes(userId)) {
      throw new ApiError(403, "Not authorized to access this conversation")
    }

    await messageService.markMessagesAsRead(conversationId, userId)

    res.json(new ApiResponse(200, null, "Messages marked as read"))
  })

  // Edit message
  editMessage = asyncHandler(async (req, res) => {
    const messageId = req.params.id
    const { content } = req.body
    const userId = req.user.id

    if (!content || content.trim().length === 0) {
      throw new ApiError(400, "Message content is required")
    }

    const message = await messageService.editMessage(messageId, userId, content.trim())

    // Emit to socket
    const conversationId = message.conversation
    req.app.get("io").to(conversationId).emit("message-edited", message)

    res.json(new ApiResponse(200, { message }, "Message edited successfully"))
  })

  // Delete message
  deleteMessage = asyncHandler(async (req, res) => {
    const messageId = req.params.id
    const userId = req.user.id

    const message = await messageService.deleteMessage(messageId, userId)

    // Emit to socket
    const conversationId = message.conversation
    req.app.get("io").to(conversationId).emit("message-deleted", { messageId })

    res.json(new ApiResponse(200, null, "Message deleted successfully"))
  })

  // Archive conversation
  archiveConversation = asyncHandler(async (req, res) => {
    const conversationId = req.params.id
    const userId = req.user.id

    const conversation = await messageService.archiveConversation(conversationId, userId)

    res.json(new ApiResponse(200, { conversation }, "Conversation archived successfully"))
  })
}

export default new MessageController()
