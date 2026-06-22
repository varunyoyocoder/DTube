const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    console.log("verify err:", err);
    console.log("decoded user:", user);
    if (err) return res.sendStatus(403);
    const result = await User.findOne({ username: user.username });
    req.userId = result._id;
    console.log(req);
    next();
  });
}

module.exports = authenticateAccessToken;
