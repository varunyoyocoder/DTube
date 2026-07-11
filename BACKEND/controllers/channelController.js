const Users = require("../models/Users");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");
const VideosLikes = require("../models/VideosLikes");
const CommentsLikes = require("../models/CommentsLikes");
const Reports = require("../models/Reports");
const updateModeration = require("../utils/updateModeration");
const uploadToS3 = require("../utils/uploadToS3");
const deleteFromS3 = require("../utils/deleteFromS3");
const keyFromURL = require("../utils/getKeyFromURL");

exports.changeProfilePicture = async (req, res) => {
  console.log("Received request to change profile picture");
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded",
      });
    }
    const user = await Users.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    if (user.profileImageURL) {
      await deleteFromS3(keyFromURL(user.profileImageURL));
    }
    const newprofileImageURL = await uploadToS3(req.file, "profilePictures");
    user.profileImageURL = newprofileImageURL;
    console.log("New profile image URL:", newprofileImageURL);
    await user.save();
    res.json({
      message: "Profile picture updated",
      profileImageURL: newprofileImageURL,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.removeProfilePicture = async (req, res) => {
  try {
    const user = await Users.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    if (!user.profileImageURL) {
      return res.json({
        message: "No profile image present",
      });
    }
    if (user.profileImageURL) {
      console.log(keyFromURL(user.profileImageURL));
      await deleteFromS3(keyFromURL(user.profileImageURL));
    }
    user.profileImageURL = "";
    await user.save();
    res.json({
      message: "Profile picture removed",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!req.files || !req.files.thumbnail || !req.files.video) {
      return res.status(400).json({
        error: "Thumbnail and video required",
      });
    }
    const ownerName=await Users.findById(req.userId).then(user => user.username);
    const thumbnailURL = await uploadToS3(req.files.thumbnail[0], "thumbnails");
    const videoURL = await uploadToS3(req.files.video[0], "videos");
    const video = await Videos.create({
      title: title,
      description: description,
      category: category,
      thumbnailURL: thumbnailURL,
      videoURL: videoURL,
      ownerId: req.userId,
      ownerName: ownerName,
    });
    res.status(201).json({
      message: "Video created",
      video: video,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Videos.findById(req.params.videoId);
    const userId=req.userId;
    const user=await Users.findById(userId)
    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }
    if (!video.ownerId.equals(req.userId) && req.user.role!=="admin") {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }
    if (video.thumbnailURL) {
      await deleteFromS3(keyFromURL(video.thumbnailURL));
    }
    if (video.videoURL) {
      await deleteFromS3(keyFromURL(video.videoURL));
    }
    await Comments.deleteMany({
      videoId: video._id,
    });
    await CommentsLikes.deleteMany({
      videoId: video._id,
    });
    await VideosLikes.deleteMany({
      videoId: video._id,
    });
    // await Reports.deleteMany({
    //   targetType: "video",
    //   targetId: video._id,
    // });
    await Videos.findByIdAndDelete(video._id);
    res.json({
      message: "Video deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
