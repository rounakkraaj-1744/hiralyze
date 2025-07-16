import messageService from "../services/message.service"
import logger from "../utils/logger"

const socketConfig = (io) => {
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`)

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId)
      logger.info(`User ${socket.id} joined conversation ${conversationId}`)
    })

    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId)
      logger.info(`User ${socket.id} left conversation ${conversationId}`)
    })

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

    socket.on("typing", (data) => {
      socket.to(data.conversationId).emit("user-typing", {
        userId: data.userId,
        isTyping: data.isTyping,
      })
    })

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`)
    })
  })
}

module.exports = { socketConfig }
