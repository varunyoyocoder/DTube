
function isAdmin(req, res, next) {
  if (!req.user) {
  return res.status(404).json({
    error: "User not found",
  });
}
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required",
    });
  }
  next();
}
module.exports = isAdmin;