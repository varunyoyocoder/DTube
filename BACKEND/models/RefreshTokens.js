const mongoose = require("mongoose");

const refreshTokensSchema = new mongoose.Schema(
  {
    refreshToken: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("RefreshTokens", refreshTokensSchema);
