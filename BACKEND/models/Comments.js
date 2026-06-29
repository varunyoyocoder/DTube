const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Videos",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "flagged", "removed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Comments", commentsSchema);
