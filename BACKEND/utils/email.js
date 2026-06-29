const nodemailer = require("nodemailer");

function sendOTPEmail(email, otp,otpExpiry) {
  console.log(`Sending OTP ${otp} to email: ${email}`);
  const mailOptions = {
    from: "dtubeadmin@gmail.com",
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is: ${otp}. It will expire in ${otpExpiry/60} minutes.`,
  };
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dtubeadmin@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transporter.verify(function (error, success) {
    if (error) {
      console.log("VERIFY ERROR:");
      console.log(error);
    } else {
      console.log("SMTP READY");
    }
  });
  transporter.sendMail(mailOptions, (error, info) => {
    console.log("sendMail callback executed");

    if (error) {
      console.error("EMAIL ERROR FULL:");
      console.error(error);
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.log("EMAIL SENT:");
      console.log(info.response);
    }
  });
}

module.exports = sendOTPEmail;