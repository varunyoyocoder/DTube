const mongoose = require("mongoose");

const subscribersSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  },
);


subscribersSchema.index({ channelId: 1, subscriberId: 1 }, { unique: true });
module.exports = mongoose.model("Subscribers", subscribersSchema);
