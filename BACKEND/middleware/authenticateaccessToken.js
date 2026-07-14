const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

function authenticateAccessToken(req, res, next) {
  
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token){
 console.log("No token");
    return res.status(401).json({message:"token empty"});
  } 
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) return res.status(401).json({error:"invalid access token"});
    const result = await Users.findOne({ username: payload.username }); 
    if (!result) {
    return res.status(404).json({
        error: "User not found",
    });
}
if (result.isBanned) {
    return res.status(403).json({
        error: "User is banned",
    });
}
    req.userId = result._id;
    req.user=result;
    next();
  });
}

module.exports = authenticateAccessToken;
