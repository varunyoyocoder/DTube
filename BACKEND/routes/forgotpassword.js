const express = require("express");
const router = express.Router();

const {
  getForgotPassword,
  requestOTP,
  verifyOTP,
} = require("../controllers/forgotPasswordController");

router.get("/", getForgotPassword);

router.post("/reqOTP", requestOTP);

router.post("/verifyOTP", verifyOTP);

module.exports = router;