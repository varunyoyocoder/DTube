const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/Users");
const RefreshTokens = require("../models/RefreshTokens");

const strongPassword = require("../utils/password");

const generateAccessToken = require("../utils/token");
const generateRefreshToken = require("../utils/token");

const axios = require("axios");

exports.register = async (req, res) => {
  const { username, email, password, captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({
      error: "Please complete reCAPTCHA",
    });
  }

  const verifyURL =
    `https://www.google.com/recaptcha/api/siteverify` +
    `?secret=${process.env.RECAPTCHA_SECRET_KEY}` +
    `&response=${captchaToken}`;

  const response = await axios.post(verifyURL);

  if (!response.data.success) {
    return res.status(400).json({
      error: "reCAPTCHA verification failed",
    });
  }

  try {
    const { username, email, password } = req.body;
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }
    if (!strongPassword(password)) {
      return res.status(400).json({
        error: "Weak password",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({
      error: "Please complete reCAPTCHA",
    });
  }

  const verifyURL =
    `https://www.google.com/recaptcha/api/siteverify` +
    `?secret=${process.env.RECAPTCHA_SECRET_KEY}` +
    `&response=${captchaToken}`;

  const response = await axios.post(verifyURL);

  if (!response.data.success) {
    return res.status(400).json({
      error: "reCAPTCHA failed",
    });
  }
  const user = await Users.findOne({ email });
  console.log(user);

  if (!user) {
    return res.status(404).json({
      error: "Email not found",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({
      error: "Invalid password",
    });
  }

  const accessToken = generateAccessToken({
    username: user.username,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    username: user.username,
    email: user.email,
  });
  await RefreshTokens.create({
    refreshToken,
  });
  

  res.json({
    accessToken,
    refreshToken,
    userId: user._id,
    username: user.username,
    profileImage:user.profileImageURL,
  });
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) return res.sendStatus(401);

    const refreshToken = await RefreshTokens.findOne({
      refreshToken: token,
    });

    if (!refreshToken)
      return res.status(403).json({
        error: "refreshToken not found",
      });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err)
        return res.status(403).json({
          error: "Invalid refreshToken",
        });

      const accessToken = generateAccessToken({
        username: payload.username,
        email: payload.email,
      });

      res.json({
        accessToken,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.logout = async (req, res) => {
  console.log("In logout");
  try {
    await RefreshTokens.deleteOne({
      refreshToken: req.body.refreshToken,
    });

    return res.send(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
