const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const strongPassword = require("../utils/password");

const generateAccessToken = require("../utils/accesstoken");

const refreshTokens = require("../utils/refreshTokens");

exports.getRegister = (req, res) => {
  res.render("register.ejs", {
    email: null,
    username: null,
    error1: null,
    error2: null,
  });
};

exports.register = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("HEADERS:", req.headers["content-type"]);
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render("register.ejs", {
        email: null,
        username: null,
        error1: "Email already exists",
        error2: null,
      });
    }
    if (!strongPassword(password)) {
      return res.render("register.ejs", {
        email: email,
        username: username,
        error1: null,
        error2: "Weak password",
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
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login.ejs", {
      error1: "Email not found",
      error2: null,
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.render("login.ejs", {
      email,
      error1: null,
      error2: "Invalid password",
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
  refreshTokens.push(refreshToken);

  res.json({
    accessToken,
    refreshToken,
  });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({
      username: user.username,
      email: user.email,
    });

    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  const refreshToken = req.body.token;
  const index = refreshTokens.indexOf(refreshToken);

  if (index > -1) {
    refreshTokens.splice(index, 1);
  }

  res.sendStatus(204);
};
