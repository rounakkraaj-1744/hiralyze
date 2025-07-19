import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      sparse: true,
    },
    linkedinId: {
      type: String,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    profile: {
      phone: String,
      location: String,
      title: String,
      bio: String,
      experience: String,
      education: String,
      skills: [String],
      linkedin: String,
      github: String,
      website: String,
      resume: String,
      company: String,
      department: String,
    },
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        jobAlerts: { type: Boolean, default: true },
        messageAlerts: { type: Boolean, default: true },
        applicationUpdates: { type: Boolean, default: true },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "recruiters", "private"],
          default: "public",
        },
        showEmail: { type: Boolean, default: false },
        showPhone: { type: Boolean, default: false },
        allowMessages: { type: Boolean, default: true },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

userSchema.index({ email: 1 })
userSchema.index({ googleId: 1 })
userSchema.index({ linkedinId: 1 })
userSchema.index({ role: 1 })
userSchema.index({ "profile.skills": 1 })

userSchema.virtual("fullName").get(function () {
  return this.name
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date()
  return this.save()
}

export default mongoose.model("User", userSchema)
