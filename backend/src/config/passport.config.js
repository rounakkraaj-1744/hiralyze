import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {Strategy as LinkedInStrategy} from "passport-linkedin-oauth2"
import userService from "../services/user.service.js"
import logger from "../utils/logger.js"
import dotenv from "dotenv"
dotenv.config ()

const initializePassport = (app) => {
  // Google OAuth
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userData = {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profilePhoto: profile.photos[0].value,
            role: "candidate",
          }

          const user = await userService.findOrCreateUser(userData, "google")
          return done(null, user)
        } catch (error) {
          logger.error("Google OAuth error:", error)
          return done(error, null)
        }
      },
    ),
  )

  // LinkedIn OAuth (OpenID Connect)
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL || "http://localhost:8080/auth/linkedin/callback",
        scope: ["openid", "profile", "email"],
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userData = {
            linkedinId: profile.id,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
            name: profile.displayName,
            profilePhoto: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
            role: "candidate",
          }

          const user = await userService.findOrCreateUser(userData, "linkedin")
          return done(null, user)
        } catch (error) {
          logger.error("LinkedIn OAuth error:", error)
          return done(error, null)
        }
      },
    ),
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.findById(id)
      done(null, user)
    } catch (error) {
      logger.error("Passport deserialize error:", error)
      done(error, null)
    }
  })

  app.use(passport.initialize())
  app.use(passport.session())
}

export { initializePassport }