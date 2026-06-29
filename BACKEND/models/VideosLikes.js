const mongoose = require("mongoose");

const videosLikesSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);

videosLikesSchema.index({ videoId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("VideosLikes", videosLikesSchema);
