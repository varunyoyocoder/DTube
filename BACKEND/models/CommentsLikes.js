const mongoose = require("mongoose");

const commentsLikesSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Videos",
          required: true,
        },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CommentsLikes", commentsLikesSchema);

