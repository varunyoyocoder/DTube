const mongoose = require("mongoose");

const reportsSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    targetContentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["comment", "video"],
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "sexual_content",
        "privacy_violation",
        "harassment",
        "hate_speech",
        "spam",
        "violence",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  },
);
reportsSchema.index(
  {
    reporterId: 1,
    targetContentId: 1,
  },
  { unique: true },
);

module.exports = mongoose.model("Reports", reportsSchema);
