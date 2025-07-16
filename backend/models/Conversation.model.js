import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    type: {
      type: String,
      enum: ["direct", "group", "support"],
      default: "direct",
    },
    title: String,
    archived: {
      type: Boolean,
      default: false,
    },
    archivedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        archivedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    muted: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        mutedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

conversationSchema.index({ participants: 1 })
conversationSchema.index({ job: 1 })
conversationSchema.index({ application: 1 })
conversationSchema.index({ updatedAt: -1 })

conversationSchema.virtual("unreadCount").get(() => {
  return 0
})

module.exports = mongoose.model("Conversation", conversationSchema)