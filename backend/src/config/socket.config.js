import messageService from "../services/message.service.js"
import logger from "../utils/logger.js"

const socketConfig = (io) => {
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`)

    // Join conversation room
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId)
      logger.info(`User ${socket.id} joined conversation ${conversationId}`)
    })

    // Leave conversation room
    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId)
      logger.info(`User ${socket.id} left conversation ${conversationId}`)
    })

    // Handle text messages
    socket.on("send-message", async (data) => {
      try {
        const { conversationId, content, senderId } = data
        const message = await messageService.createMessage({
          conversation: conversationId,
          sender: senderId,
          content,
        })

        io.to(conversationId).emit("new-message", message)
      } catch (error) {
        logger.error("Socket message error:", error)
        socket.emit("error", { message: "Failed to send message" })
      }
    })

    // Handle typing indicators
    socket.on("typing", (data) => {
      socket.to(data.conversationId).emit("user-typing", {
        userId: data.userId,
        isTyping: data.isTyping,
      })
    })

    // Video/Voice Call WebRTC Signaling
    socket.on("join-video-call", ({ conversationId }) => {
      socket.join(`call-${conversationId}`)
      socket.to(`call-${conversationId}`).emit("user-joined-call", { userId: socket.id })
      logger.info(`User ${socket.id} joined video call for conversation ${conversationId}`)
    })

    socket.on("join-voice-call", ({ conversationId }) => {
      socket.join(`call-${conversationId}`)
      socket.to(`call-${conversationId}`).emit("user-joined-call", { userId: socket.id })
      logger.info(`User ${socket.id} joined voice call for conversation ${conversationId}`)
    })

    // WebRTC signaling events
    socket.on("call-offer", ({ conversationId, offer }) => {
      socket.to(`call-${conversationId}`).emit("call-offer", offer)
      logger.info(`Call offer sent for conversation ${conversationId}`)
    })

    socket.on("call-answer", ({ conversationId, answer }) => {
      socket.to(`call-${conversationId}`).emit("call-answer", answer)
      logger.info(`Call answer sent for conversation ${conversationId}`)
    })

    socket.on("ice-candidate", ({ conversationId, candidate }) => {
      socket.to(`call-${conversationId}`).emit("ice-candidate", candidate)
    })

    socket.on("end-call", ({ conversationId }) => {
      socket.to(`call-${conversationId}`).emit("call-ended")
      socket.leave(`call-${conversationId}`)
      logger.info(`Call ended for conversation ${conversationId}`)
    })

    // Handle call status updates
    socket.on("call-status", ({ conversationId, status }) => {
      socket.to(`call-${conversationId}`).emit("call-status-update", {
        userId: socket.id,
        status,
      })
    })

    // Handle media control updates (mute/unmute, video on/off)
    socket.on("media-control", ({ conversationId, type, enabled }) => {
      socket.to(`call-${conversationId}`).emit("media-control-update", {
        userId: socket.id,
        type, // 'audio' or 'video'
        enabled,
      })
    })

    // Handle screen sharing
    socket.on("screen-share", ({ conversationId, isSharing }) => {
      socket.to(`call-${conversationId}`).emit("screen-share-update", {
        userId: socket.id,
        isSharing,
      })
    })

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`)
    })
  })
}

export { socketConfig }
