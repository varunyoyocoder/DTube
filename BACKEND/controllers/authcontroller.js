const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RefreshTokens=require("../models/RefreshTokens");

const strongPassword = require("../utils/password");

const generateAccessToken = require("../utils/accesstoken");

const axios = require("axios");

exports.getRegister = (req, res) => {
  res.render("register.ejs", {
    email: null,
    username: null,
    error1: null,
    error2: null,
    siteKey: process.env.RECAPTCHA_SITE_KEY,
  });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const captchaToken = req.body["g-recaptcha-response"];

  if (!captchaToken) {
    return res.render("register.ejs", {
      email,
      username,
      error1: "Please complete reCAPTCHA",
      error2: null,
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    });
  }

  const verifyURL =
    `https://www.google.com/recaptcha/api/siteverify` +
    `?secret=${process.env.RECAPTCHA_SECRET_KEY}` +
    `&response=${captchaToken}`;

  const response = await axios.post(verifyURL);

  if (!response.data.success) {
    return res.render("register.ejs", {
      email,
      username,
      error1: "reCAPTCHA verification failed",
      error2: null,
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    });
  }
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render("register.ejs", {
        email: null,
        username: null,
        error1: "Email already exists",
        error2: null,
        siteKey: process.env.RECAPTCHA_SITE_KEY,
      });
    }
    if (!strongPassword(password)) {
      return res.render("register.ejs", {
        email: email,
        username: username,
        error1: null,
        error2: "Weak password",
        siteKey: process.env.RECAPTCHA_SITE_KEY,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.redirect("/auth/login");
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getLogin = (req, res) => {
  res.render("login.ejs", {
    email: null,
    error1: null,
    error2: null,
    siteKey: process.env.RECAPTCHA_SITE_KEY,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const captchaToken = req.body["g-recaptcha-response"];

  if (!captchaToken) {
    return res.render("login.ejs", {
      email,
      error1: "Please complete reCAPTCHA",
      error2: null,
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    });
  }

  const verifyURL =
    `https://www.google.com/recaptcha/api/siteverify` +
    `?secret=${process.env.RECAPTCHA_SECRET_KEY}` +
    `&response=${captchaToken}`;

  const response = await axios.post(verifyURL);

  if (!response.data.success) {
    return res.render("login.ejs", {
      email,
      error1: "reCAPTCHA failed",
      error2: null,
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login.ejs", {
      error1: "Email not found",
      error2: null,
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.render("login.ejs", {
      email,
      error1: null,
      error2: "Invalid password",
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    });
  }

  const accessToken = generateAccessToken({
    username: user.username,
    email: user.email,
  });

  const refreshToken = jwt.sign(
    {
      username: user.username,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
  );
  RefreshTokens.insertOne({refreshToken:refreshToken});

  await user.save();
  res.json({
    accessToken,
    refreshToken,
  });
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) return res.sendStatus(401);

    const refreshToken  = await RefreshTokens.findOne({
      refreshToken: token,
    });

    if (!refreshToken) return res.sendStatus(403);

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({
          username: payload.username,
          email: payload.email,
        });

        res.json({
          accessToken,
        });
      },
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    await RefreshTokens.deleteOne({refreshToken:req.body.token});
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
