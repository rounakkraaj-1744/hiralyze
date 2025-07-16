require("dotenv").config()
const App = require("./app")
const logger = require("./utils/logger")

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err)
  process.exit(1)
})

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err)
  process.exit(1)
})

const app = new App()
app.listen()

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})
