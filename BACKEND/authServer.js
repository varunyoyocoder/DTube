require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// const mongoose=require(mongoose);
// mongoose.connect("mongodb://localhost/databaseName",useNewUrlParser:true);
// const db=mongoose.connection;
// db.on("error",(error))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const users = [];

let refreshTokens = [];

app.get("/register", (req, res) => {
  res.render("register.ejs", {
    email: null,
    username: null,
    error1: null,
    error2: null,
  });
});

app.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = users.find((user) => user.email === req.body.email);
    if (user) {
      res.render("register.ejs", {
        email: null,
        username: username,
        error1: "Email already exists",
        error2: null,
      });
      return;
    } else if (!strongPassword(password)) {
      res.render("register.ejs", {
        email: email,
        username: username,
        error1: null,
        error2: "weak password",
      });
      return;
    } else {
      const user = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      };
      users.push(user);
      res.redirect("/login");
      console.log(users);
    }
  } catch (err) {
    // res.send(err);
    console.error(err);
    // res.status(500).send("error creating user");
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { email: null, error1: null, error2: null });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const user = users.find((user) => user.email === email);
  if (user == null) {
    res.render("login.ejs", { error1: "Email not found", error2: null });
    return;
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({
        username: user.username,
        email: user.email,
      });
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.render("login.ejs", {
        email: email,
        error1: null,
        error2: "Invalid password",
      });
    }
  } catch {
    res.status(500).send("error logging in");
  }
});

const otpcache = {};
let otpSpam={};
const otpExpiry=300;

function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpcache[email] = otp;
  setTimeout(() => {
    delete otpcache[email];
  }, otpExpiry*1000); // OTP expires after 5 minutes
  return otp;
}

function sendOTPEmail(email, otp) {
  // Implement your email sending logic here using a service like nodemailer, SendGrid, etc.
  console.log(`Sending OTP ${otp} to email: ${email}`);
  const mailOptions = {
    from: "dtubeadmin@gmail.com",
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is: ${otp}. It will expire in ${otpExpiry/60} minutes.`,
  };
  console.log(process.env.EMAIL_PASSWORD);
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

app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword.ejs", { error: null, showOTP: false, email: "" });
});

function canRequestOTP(email) {
  const today = new Date().toISOString().split("T")[0];

  if (!otpSpam[email]) {
    otpSpam[email] = {
      count: 1,
      date: today,
    };
    console.log(otpSpam[email])
    return true;
  }
  
  if (otpSpam[email].date !== today) {
    otpSpam[email] = {
      count: 1,
      date: today,
    };
    console.log(otpSpam[email])
    return true;
  }

  if (otpSpam[email].count >= 3) {
    return false;
  }

  otpSpam[email].count++;
  return true;
}

app.post("/reqOTP", (req, res) => {
  const email = req.body.email;
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.render("forgotpassword.ejs", {
      error: "Email not found",
      showOTP: false,
      email: email,
    });
  }
  if (!canRequestOTP(email)) {
  return res.render("forgotpassword.ejs", {
    error: "Daily OTP limit exceeded",
    showOTP: false,
    email: email,
  });
}
  const otp = generateOTP(email);
  sendOTPEmail(email, otp);
  res.render("forgotpassword.ejs", {
    error: null,
    showOTP: true,
    email: email,
  });
});

app.post("/verifyOTP", (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  console.log("Generated OTP:", otp);
  console.log(otpcache);
  if (otpcache[email] !== otp) {
    return res.render("forgotpassword.ejs", {
      error: "Invalid OTP",
      showOTP: false,
      email: email,
    });
  }
  delete otpcache[email];
  res.redirect(`/resetpassword?email=${email}`);
});

app.get("/resetpassword", (req, res) => {
  res.render("resetpassword.ejs", {
    email: req.query.email,
    error1: null,
    error2: null,
  });
});

function strongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^\w\s]/.test(password)
  );
}
app.post("/resetpassword", async (req, res) => {
  const newpassword = req.body.newpassword;
  const email = req.body.email;
  if (!strongPassword(newpassword))
    return res.render("resetpassword.ejs", {
      email: email,
      error1: "weak password",
      error2: null,
    });
  const confirmedpassword = req.body.confirmedpassword;
  if (confirmedpassword !== newpassword)
    return res.render("resetpassword.ejs", {
      email: email,
      error1: null,
      error2: "passwords do not match",
    });
  const user = users.find((user) => user.email === email);
  user.password = await bcrypt.hash(newpassword, 10);
  res.redirect("/login");
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      username: user.username,
      email: user.email,
    });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.sendStatus(204);
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}
