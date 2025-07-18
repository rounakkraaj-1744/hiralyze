import Message from "../models/Message.model.js"
import Conversation from "../models/Conversation.model.js"
import { ApiError } from "../utils/apiError.js"
import logger from "../utils/logger.js"

class MessageService {
  async createMessage(messageData) {
    try {
      const message = new Message(messageData)
      await message.save()

      await Conversation.findByIdAndUpdate(messageData.conversation, {
        lastMessage: message._id,
        updatedAt: new Date(),
      })

      await message.populate("sender", "name profilePhoto")

      logger.info(`New message created in conversation: ${messageData.conversation}`)
      return message
    } catch (error) {
      logger.error("Error creating message:", error)
      throw new ApiError(500, "Error creating message")
    }
  }

  async getMessagesByConversation(conversationId, page = 1, limit = 50) {
    try {
      const messages = await Message.find({
        conversation: conversationId,
        deleted: false,
      })
        .populate("sender", "name profilePhoto")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)

      return messages.reverse() // Return in chronological order
    } catch (error) {
      logger.error("Error getting messages:", error)
      throw new ApiError(500, "Error retrieving messages")
    }
  }

  async markMessagesAsRead(conversationId, userId) {
    try {
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: userId },
          "readBy.user": { $ne: userId },
        },
        {
          $push: {
            readBy: {
              user: userId,
              readAt: new Date(),
            },
          },
        },
      )

      logger.info(`Messages marked as read in conversation: ${conversationId}`)
    } catch (error) {
      logger.error("Error marking messages as read:", error)
      throw new ApiError(500, "Error marking messages as read")
    }
  }

  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId)
      if (!message) {
        throw new ApiError(404, "Message not found")
      }

      if (message.sender.toString() !== userId) {
        throw new ApiError(403, "Not authorized to delete this message")
      }

      message.deleted = true
      message.deletedAt = new Date()
      await message.save()

      logger.info(`Message deleted: ${messageId}`)
      return message
    } catch (error) {
      logger.error("Error deleting message:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error deleting message")
    }
  }

  async editMessage(messageId, userId, newContent) {
    try {
      const message = await Message.findById(messageId)
      if (!message) {
        throw new ApiError(404, "Message not found")
      }

      if (message.sender.toString() !== userId) {
        throw new ApiError(403, "Not authorized to edit this message")
      }

      message.content = newContent
      message.edited = true
      message.editedAt = new Date()
      await message.save()

      await message.populate("sender", "name profilePhoto")

      logger.info(`Message edited: ${messageId}`)
      return message
    } catch (error) {
      logger.error("Error editing message:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error editing message")
    }
  }

  async getConversationsByUser(userId, page = 1, limit = 20) {
    try {
      const conversations = await Conversation.find({
        participants: userId,
        archived: false,
      })
        .populate("participants", "name profilePhoto role")
        .populate("lastMessage")
        .populate("job", "title company")
        .populate("application", "status")
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)

      for (const conversation of conversations) {
        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: userId },
          "readBy.user": { $ne: userId },
        })
        conversation.unreadCount = unreadCount
      }

      return conversations
    } catch (error) {
      logger.error("Error getting conversations:", error)
      throw new ApiError(500, "Error retrieving conversations")
    }
  }

  async createConversation(participantIds, jobId, applicationId) {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: participantIds },
        job: jobId,
      })

      if (conversation) {
        return conversation
      }

      conversation = new Conversation({
        participants: participantIds,
        job: jobId,
        application: applicationId,
      })

      await conversation.save()
      await conversation.populate([
        { path: "participants", select: "name profilePhoto role" },
        { path: "job", select: "title company" },
        { path: "application", select: "status" },
      ])

      logger.info(`New conversation created between users: ${participantIds.join(", ")}`)
      return conversation
    } catch (error) {
      logger.error("Error creating conversation:", error)
      throw new ApiError(500, "Error creating conversation")
    }
  }

  async archiveConversation(conversationId, userId) {
    try {
      const conversation = await Conversation.findById(conversationId)
      if (!conversation) {
        throw new ApiError(404, "Conversation not found")
      }

      if (!conversation.participants.includes(userId)) {
        throw new ApiError(403, "Not authorized to archive this conversation")
      }

      conversation.archivedBy.push({
        user: userId,
        archivedAt: new Date(),
      })

      await conversation.save()

      logger.info(`Conversation archived: ${conversationId} by user: ${userId}`)
      return conversation
    } catch (error) {
      logger.error("Error archiving conversation:", error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, "Error archiving conversation")
    }
  }
}

export default new MessageService()