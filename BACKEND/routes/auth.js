const express = require("express");
const router = express.Router();

const {
  getRegister,
  register,
  getLogin,
  login,
  refreshToken,
  logout,
  me
} = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/token", refreshToken);
router.get("/me",me)

router.post("/logout", logout);

module.exports = router;