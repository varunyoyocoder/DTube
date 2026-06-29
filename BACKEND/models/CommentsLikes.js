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
      ref: "Users",
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

commentsLikesSchema.index({ commentId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("CommentsLikes", commentsLikesSchema);

