import session from "express-session"
import MongoStore from "connect-mongo"

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "hr-portal-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
  },
})

module.exports = { sessionConfig }