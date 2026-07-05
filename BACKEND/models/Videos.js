const mongoose = require("mongoose");

const videosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    videoURL: {
      type: String,
      required: true,
    },

    thumbnailURL: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },  
    views: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "flagged", "removed"],
      default: "active",
    },
    reportCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

videosSchema.index({ views: -1 });
module.exports = mongoose.model("Videos", videosSchema);
