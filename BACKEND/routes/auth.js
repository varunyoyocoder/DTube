const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateaccessToken");

const {
  getRegister,
  register,
  getLogin,
  login,
  refreshToken,
  logout,
  dauthToken,
  me
} = require("../controllers/authController");
router.post("/register", register);
router.post("/login", login);
router.post("/token", refreshToken);
router.get("/me",authenticateToken,me)
router.post("/dauth/token",dauthToken)
router.post("/logout", logout);

module.exports = router;