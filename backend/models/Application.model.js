import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String,
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "interviewing", "offered", "hired", "rejected", "withdrawn"],
      default: "applied",
    },
    aiAnalysis: {
      summary: String,
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
      skills: [String],
      experience: String,
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
      skillsMatch: Number,
      experienceMatch: Number,
      overallMatch: Number,
      processedAt: Date,
    },
    timeline: [
      {
        status: {
          type: String,
          enum: ["applied", "reviewing", "shortlisted", "interviewing", "offered", "hired", "rejected", "withdrawn"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    interviews: [
      {
        type: {
          type: String,
          enum: ["phone", "video", "onsite", "technical", "hr"],
        },
        scheduledAt: Date,
        duration: Number, // in minutes
        interviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["scheduled", "completed", "cancelled", "rescheduled"],
          default: "scheduled",
        },
        feedback: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    notes: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
    withdrawnAt: Date,
    withdrawnReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true })
applicationSchema.index({ candidate: 1 })
applicationSchema.index({ job: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ createdAt: -1 })
applicationSchema.index({ "aiAnalysis.score": -1 })

applicationSchema.pre("save", function (next) {
  if (this.isModified("status") && !this.isNew) {
    this.timeline.push({
      status: this.status,
      date: new Date(),
    })
  }
  next()
})

applicationSchema.virtual("latestInterview").get(function () {
  if (this.interviews && this.interviews.length > 0) {
    return this.interviews.sort((a, b) => b.scheduledAt - a.scheduledAt)[0]
  }
  return null
})

module.exports = mongoose.model("Application", applicationSchema)
