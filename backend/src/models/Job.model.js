import mongoose from "mongoose"

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    experience: {
      type: String,
      enum: ["entry", "mid", "senior", "executive"],
      required: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    salary: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly",
      },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    department: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "closed", "expired"],
      default: "active",
    },
    applicationDeadline: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

jobSchema.index({ title: "text", description: "text", company: "text" })
jobSchema.index({ postedBy: 1 })
jobSchema.index({ status: 1 })
jobSchema.index({ type: 1 })
jobSchema.index({ experience: 1 })
jobSchema.index({ location: 1 })
jobSchema.index({ skills: 1 })
jobSchema.index({ createdAt: -1 })
jobSchema.index({ featured: 1, createdAt: -1 })

jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "job",
})

jobSchema.methods.updateApplicationsCount = async function () {
  const Application = mongoose.model("Application")
  this.applicationsCount = await Application.countDocuments({ job: this._id })
  return this.save()
}

jobSchema.methods.incrementViews = function () {
  this.viewsCount += 1
  return this.save()
}

export default mongoose.model("Job", jobSchema)
