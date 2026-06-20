require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();

const ejs = require('ejs');
app.set("view engine", "ejs");

const connectDB = require("./config/db");
const authenticateToken = require("./middleware/authenticateToken");
const authRoutes = require("./routes/auth");
const forgotPasswordRoutes = require("./routes/forgotpassword");
const resetPasswordRoutes = require("./routes/resetpassword");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectDB();
app.use("/auth", authRoutes);
app.use("/forgotpassword", forgotPasswordRoutes);
app.use("/resetpassword", resetPasswordRoutes);


const posts = [
  { username: "tharun", title: "post1" },
  {
    username: "tharun",
    title: "post2",
  },
  {
    username: "varun",
    title: "post3",
  },
];

app.get("/", (req, res) => {
  res.send("Server working");
});

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req.user);
  res.json(posts.filter((post) => post.username === req.user.username));
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
