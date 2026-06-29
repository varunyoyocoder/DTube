const Users = require("../models/Users");
async function   isAdmin(req, res, next) {
  const user=await Users.findById(req.userId);
  if (user.role !== "admin") {
    return res.sendStatus(403);
  }
  next();
}
module.exports=isAdmin;