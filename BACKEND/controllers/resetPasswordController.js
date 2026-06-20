const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const strongPassword = require("../utils/password");

exports.getResetPassword = (req, res) => {
  res.render("resetpassword.ejs", {
    email: req.query.email,
    error1: null,
    error2: null,
  });
};

exports.resetPassword = async (req, res) => {
  const { email, newpassword, confirmedpassword } = req.body;

  if (!strongPassword(newpassword)) {
    return res.render("resetpassword.ejs", {
      email,
      error1: "weak password",
      error2: null,
    });
  }

  if (newpassword !== confirmedpassword) {
    return res.render("resetpassword.ejs", {
      email,
      error1: null,
      error2: "passwords do not match",
    });
  }

  const user = await User.findOne({ email });

  user.password = await bcrypt.hash(newpassword, 10);

  await user.save();

  res.redirect("/auth/login");
};

