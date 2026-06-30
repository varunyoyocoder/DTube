const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.decode(token);

  if (!token) return res.send(403).json({message:"token empty"});

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({error:"invalid access token"});
    const result = await Users.findOne({ username: user.username }); 

    req.userId = result._id;
    next();
  });
}

module.exports = authenticateAccessToken;
