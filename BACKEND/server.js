require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const app = express();

const connectDB = require("./config/db");

const authenticateToken = require("./middleware/authenticateaccessToken");
const adminToken = require("./middleware/isAdmin");
const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/video");
const passwordRoutes = require("./routes/password");
const adminRoutes = require("./routes/admin");
const channelRoutes = require("./routes/channel");

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/videos", authenticateToken, videoRoutes);
app.use("/password", passwordRoutes);
app.use("/admin", authenticateToken, adminToken, adminRoutes);
app.use("/channel", authenticateToken, channelRoutes);

app.get("/", (req, res) => {
  res.send("Server working");
});
connectDB();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
