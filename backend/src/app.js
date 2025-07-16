const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const morgan = require("morgan")
const path = require("path")

const { connectDB } = require("./config/database")
const { initializePassport } = require("./config/passport")
const { sessionConfig } = require("./config/session")
const { socketConfig } = require("./config/socket")
const errorHandler = require("./middleware/errorHandler")
const logger = require("./utils/logger")

const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const jobRoutes = require("./routes/job.routes")
const applicationRoutes = require("./routes/application.routes")
const messageRoutes = require("./routes/message.routes")
const uploadRoutes = require("./routes/upload.routes")

class App {
  constructor() {
    this.app = express()
    this.server = require("http").createServer(this.app)
    this.io = require("socket.io")(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    })

    this.initializeDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
    this.initializeSocket()
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

module.exports = App