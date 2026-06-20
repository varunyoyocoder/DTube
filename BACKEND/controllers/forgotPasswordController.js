const User = require("../models/User");

const { generateOTP, canRequestOTP, otpcache,otpExpiry } = require("../utils/otp");

const sendOTPEmail = require("../utils/email");


exports.getForgotPassword = (req, res) => {
  res.render("forgotpassword.ejs", {
    error: null,
    showOTP: false,
    email: "",
  });
};

exports.requestOTP = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });

  if (!user) {
    return res.render("forgotpassword.ejs", {
      error: "Email not found",
      showOTP: false,
      email:null,
    });
  }

  if (!canRequestOTP(email)) {
    return res.render("forgotpassword.ejs", {
      error: "Daily OTP limit exceeded",
      showOTP: false,
      email:null,
    });
  }

  const otp = generateOTP(email);

  sendOTPEmail(email, otp,otpExpiry);

  res.render("forgotpassword.ejs", {
    error: null,
    showOTP: true,
    email,
  });
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (otpcache[email] !== otp) {
    return res.render("forgotpassword.ejs", {
      error: "Invalid OTP",
      showOTP: false,
      email,
    });
  }

  delete otpcache[email];

  res.redirect(`/resetpassword?email=${email}`);
};