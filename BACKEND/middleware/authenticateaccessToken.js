const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    const result = await Users.findOne({ username: user.username });
    req.userId = result._id;
    next();
  });
}

module.exports = authenticateAccessToken;
