import session from "express-session"
import MongoStore from "connect-mongo"

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "hr-portal-secret",
  resave: false,
  saveUninitialized: false,
  store: process.env.MONGODB_URI 
    ? MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      })
    : undefined, // Use memory store if no MongoDB URI
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
  },
})

export { sessionConfig }
