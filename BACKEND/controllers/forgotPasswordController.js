const Users = require("../models/Users");

const {
  generateOTP,
  canRequestOTP,
  otpcache,
  otpExpiry,
} = require("../utils/otp");

const sendOTPEmail = require("../utils/email");

exports.requestOTP = async (req, res) => {
  const email = req.body.email;

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(404).json({
      error: "Email not found",
    });
  }

  if (!canRequestOTP(email)) {
    return res.status(429).json({
      error: "Daily OTP limit exceeded",
    });
  }

  const otp = generateOTP(email);

  sendOTPEmail(email, otp, otpExpiry);
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  console.log("Email:", email);
  console.log("OTP from React:", otp);
  console.log("OTP in cache:", otpcache[email]);

  if (otpcache[email] !== otp) {
    return res.status(401).json({
      error: "Invalid otp",
    });
  }
  delete otpcache[email];
  return res.status(200).json({
    message: "OTP verified",
  });
};
