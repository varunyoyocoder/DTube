const express = require("express");
const router = express.Router();

const {
  getRegister,
  register,
  getLogin,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
router.get("/test", (req, res) => {
  res.send("Auth router working");
});

router.get("/register", getRegister);
router.post("/register", register);

router.get("/login", getLogin);
router.post("/login", login);
router.post("/token", refreshToken);

router.delete("/logout", logout);

module.exports = router;