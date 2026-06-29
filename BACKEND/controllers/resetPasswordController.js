const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/Users");
const strongPassword = require("../utils/password");

exports.resetPassword = async (req, res) => {
  const { email, newpassword, confirmpassword } = req.body;

  if (!strongPassword(newpassword)) {
   return res.status(400).json({
        error: "Weak password",
      });
  }

  if (newpassword !== confirmpassword) {
   return res.status(400).json({
    error: "Passwords do not match",
  });
  }

  const user = await Users.findOne({ email });

  user.password = await bcrypt.hash(newpassword, 10);

  await user.save();
   return res.status(200).json({
    message: "Password changed",
  });

};

