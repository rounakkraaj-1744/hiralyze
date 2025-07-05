import mongoose from "mongoose"
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    logger.info(`MongoDB Connected: ${conn.connection.host}`)

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected")
    })

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected")
    })
  } catch (error) {
    logger.error("Database connection failed:", error)
    throw error
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    logger.info("MongoDB connection closed")
  } catch (error) {
    logger.error("Error closing MongoDB connection:", error)
  }
}

module.exports = {
  connectDB,
  disconnectDB,
}
