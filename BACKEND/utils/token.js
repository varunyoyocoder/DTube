const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET,
    {
       expiresIn: "7d"
    }
  );
}

module.exports = generateAccessToken;