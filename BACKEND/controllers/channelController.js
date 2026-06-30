const Users = require("../models/Users");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");
const VideosLikes = require("../models/VideosLikes");
const CommentsLikes = require("../models/CommentsLikes");
const Reports = require("../models/Reports");
const updateModeration = require("../utils/updateModeration");
const uploadToS3 = require("../utils/uploadToS3");
const deleteFromS3 = require("../utils/deleteFromS3");
const getS3Url = require("../utils/getS3Url");

exports.changeProfilePicture = async (req, res) => {
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
    if (user.profileImage) {
      console.log(user.profileImage);
      await deleteFromS3(user.profileImage);
    }
    const newProfileImageKey = await uploadToS3(req.file, "profilePictures");
    user.profileImage = newProfileImageKey;
    await user.save();
    res.json({
      message: "Profile picture updated",
      profileImage: getS3Url(newProfileImageKey),
      profileImageKey:newProfileImageKey,
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
    if(!user.profileImage){
      return res.json({
      message: "No profile image present",
    });
    }
    if (user.profileImage) {
      console.log(user.profileImage);
      await deleteFromS3(user.profileImage);
    }
    user.profileImage = "";
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
    const thumbnailUrl = await uploadToS3(req.files.thumbnail[0], "thumbnails");
    const videoUrl = await uploadToS3(req.files.video[0], "videos");
    const video = await Videos.create({
      title,
      description,
      category,
      thumbnailUrl,
      videoUrl,
      ownerId: req.userId,
    });
    res.status(201).json({
      message: "Video created",
      video,
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

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }

    if (!video.ownerId.equals(req.userId)) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    // Delete thumbnail from S3
    if (video.thumbnailUrl) {
      await deleteFromS3(getKeyFromUrl(video.thumbnailUrl));
    }

    // Delete video from S3
    if (video.videoUrl) {
      await deleteFromS3(getKeyFromUrl(video.videoUrl));
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

    await Reports.deleteMany({
      targetType: "video",
      targetId: video._id,
    });

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
