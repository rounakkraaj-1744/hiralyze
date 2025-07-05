import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import userService from "../services/user.service.js";
import logger from "../utils/logger.js";

const initializePassport = (app) => {
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
        }
        catch (error) {
          logger.error("Google OAuth error:", error)
          return done(error, null)
        }
      },
    ),
  )

  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/auth/linkedin/callback",
        scope: ["r_emailaddress", "r_liteprofile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userData = {
            linkedinId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profilePhoto: profile.photos[0].value,
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

module.exports = { initializePassport }