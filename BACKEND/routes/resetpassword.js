const express = require("express");
const router = express.Router();

const {
  getResetPassword,
  resetPassword,
} = require("../controllers/resetPasswordController");

router.get("/", getResetPassword);

router.post("/", resetPassword);

module.exports = router;