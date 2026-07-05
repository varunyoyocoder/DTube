const mongoose = require("mongoose");

const viewsSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Videos",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);
viewsSchema.index({ videoId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("VideoViews", viewsSchema);

