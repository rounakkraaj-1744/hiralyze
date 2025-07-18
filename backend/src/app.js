import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import hpp from "hpp"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"

import { connectDB } from "../config/database.config.js"
import { initializePassport } from "../config/passport.config.js"
import { sessionConfig } from "../config/session.config.js"
import { socketConfig } from "../config/socket.config.js"
import errorHandler from "../middlewares/errorHandler.js"
import logger from "../utils/logger.js"

import authRoutes from "../routes/auth.routes.js"
import userRoutes from "../routes/user.route.js"
import jobRoutes from "../routes/job.routes.js"
import applicationRoutes from "../routes/application.routes.js"
import messageRoutes from "../routes/message.routes.js"
import uploadRoutes from "../routes/upload.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class App {
  constructor() {
    this.app = express()
    this.server = null
    this.io = null
    this.initializeDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
    this.initializeSocket()
  }

  static async create() {
    const appInstance = new App()
    const http = (await import("http")).default
    const socketio = (await import("socket.io")).default
    appInstance.server = http.createServer(appInstance.app)
    appInstance.io = socketio(appInstance.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    })
    appInstance.initializeSocket()
    return appInstance
  }

  async initializeDatabase() {
    try {
      await connectDB()
      logger.info("Database connected successfully")
    } catch (error) {
      logger.error("Database connection failed:", error)
      process.exit(1)
    }
  }

  initializeMiddlewares() {
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(mongoSanitize())
    this.app.use(xss())
    this.app.use(hpp())

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, 
      max: 100, 
      message: "Too many requests from this IP, please try again later.",
    })
    this.app.use("/api/", limiter)

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      }),
    )

    this.app.use(express.json({ limit: "10mb" }))
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }))

    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"))
    } else {
      this.app.use(morgan("combined"))
    }

    this.app.use(sessionConfig)
    initializePassport(this.app)

    this.app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
  }

  initializeRoutes() {
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      })
    })

    // API routes
    this.app.use("/auth", authRoutes)
    this.app.use("/api/users", userRoutes)
    this.app.use("/api/jobs", jobRoutes)
    this.app.use("/api/applications", applicationRoutes)
    this.app.use("/api/messages", messageRoutes)
    this.app.use("/api/upload", uploadRoutes)

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      })
    })
  }

  initializeErrorHandling() {
    this.app.use(errorHandler)
  }

  initializeSocket() {
    socketConfig(this.io)
  }

  listen() {
    const port = process.env.PORT || 5000
    this.server.listen(port, () => {
      logger.info(`Server running on port ${port}`)
    })
  }
}

export default App