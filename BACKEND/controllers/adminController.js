const Users = require("../models/Users");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");
const VideosLikes = require("../models/VideosLikes");
const CommentsLikes = require("../models/CommentsLikes");
const Subscribers = require("../models/Subscribers");
const Reports=require("../models/Reports");

//Dashboard

exports.getDashboard = async (req, res) => {
  try {
    const users = await Users.find().select("username email profileImageURL role isBanned");
    const result =await Promise.all(
      users.map(async (user)=>{
         const videoCount = await Videos.countDocuments({
          ownerId: user._id,
        });
        return {
          ...user.toObject(),
          videoCount,
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId).select(
      "-password -refreshTokens",
    );

    if (!user) {
      return res.Status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  const updates = {};
  const userId = req.params.userId;
  const allowedFields = ["role", "isBanned"];
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No valid fields to update",
      });
    }
    if (updates.isBanned === true && user.role === "admin") {
      return res.status(403).json({
        error: "Cannot ban an admin",
      });
    }
    if (user.role === "admin" && updates.role !== undefined) {
      return res.status(403).json({
        error: "Cannot modify another admin's role",
      });
    }
    Object.assign(user, updates);

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.Status(404).json({ error: "User not found" });
    }
    if (user.role == "admin") {
      return res.status(403).json({ error: "admin account cannot  be deleted" });
    }
    await CommentsLikes.deleteMany({ userId: userId });
    await Comments.deleteMany({ userId: userId });
    await VideosLikes.deleteMany({ userId: userId });
    await Videos.deleteMany({ ownerId: userId });
    await Subscribers.deleteMany({ subscriberId: userId });
    await Subscribers.deleteOne({ channelId: userId });
    await Users.deleteOne({ _id: userId });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Videos
exports.getVideoById = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const video = await Videos.findById(videoId);
    if (!video) {
return res.status(404).json({
  error: "Video not found",
});
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Videos.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
//currently admin can change all attributes have to restrict
exports.updateVideo = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const video = await Videos.findByIdAndUpdate(videoId, req.body, {
      new: true,
    });
    if (!video) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.updateVideoStatus = async (req, res) => {
  const { status } = req.body;
  const VALID_STATUS = [
  "active",
  "flagged",
  "removed",
];
  if (!VALID_STATUS.includes(status)){
    return res.status(400).json({
      error: "Invalid status",
    });
  }
  try {
    const video = await Videos.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }
    if (video.status === status) {
      return res.status(400).json({
        error: `Video is already ${status}`,
      });
    }
    video.status = status;
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteVideo = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const video = await Videos.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    await Videos.deleteOne({ _id: videoId });
    await Comments.deleteMany({ videoId: videoId });
    await CommentsLikes.deleteMany({ videoId: videoId });
    await VideosLikes.deleteMany({ videoId: videoId });
    await Reports.deleteMany({
    targetType: "video",
    targetId: videoId,
});

    res.status(200).json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getCommentById = async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comments.findById(commentId);
    if (!comment) 
      {
return res.status(404).json({
  error: "Comment not found",
});
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comments.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const updates = {};

if (req.body.commentText !== undefined) {
    updates.commentText = req.body.commentText;
}
  try {
    const comment = await Comments.findByIdAndUpdate(commentId,updates, {
      new: true,
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.updateCommentStatus = async (req, res) => {
  const { status } = req.body;
  const VALID_STATUS = [
  "active",
  "flagged",
  "removed",
];
  if (!VALID_STATUS.includes(status)){
    return res.status(400).json({
      error: "Invalid status",
    });
  }
  try {
    const comment = await Comments.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    if (comment.status === status) {
      return res.status(400).json({
        error: `Comment is already ${status}`,
      });
    }

    comment.status = status;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async  (req,res)=>{
  const commentId=req.params.commentId;
  try {
    const comment=await Comments.findById(commentId);
      if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    await Comments.deleteOne({_id:commentId});
    await CommentsLikes.deleteMany({commentId:commentId});
    await Reports.deleteMany({
    targetType: "comment",
    targetId: commentId,
});
     res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


exports.getReports = async (req, res) => {
  try {
    const reports = await Reports.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
exports.resolveReport = async (req, res) => {
  const reportId=req.params.reportId
  try {
    const report = await Reports.findById(reportId);
    if(!report){
      return res.status(404).json({ error: "Report not found" });
    }
    await Reports.deleteOne({_id:reportId});
    res.json({
  message: "Report resolved"
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
