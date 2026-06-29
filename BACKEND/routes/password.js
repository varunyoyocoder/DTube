const express = require("express");
const router = express.Router();

const {
  requestOTP,
  verifyOTP,
} = require("../controllers/forgotPasswordController");

const {
  resetPassword,
} = require("../controllers/resetPasswordController");


router.post("/forgot/reqOTP", requestOTP);
router.post("/forgot/verifyOTP", verifyOTP);
router.post("/reset", resetPassword);

module.exports = router;