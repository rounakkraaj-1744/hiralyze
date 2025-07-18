import dotenv from "dotenv"
import App from "./app.js"
import logger from "../utils/logger.js"

dotenv.config()

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err)
  process.exit(1)
})

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err)
  process.exit(1)
})

const app = await App.create()
app.listen()

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})
