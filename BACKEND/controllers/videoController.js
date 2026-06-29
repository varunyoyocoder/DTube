const Users = require("../models/Users");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");
const VideosLikes = require("../models/VideosLikes");
const CommentsLikes = require("../models/CommentsLikes");
const Subscribers = require("../models/Subscribers");
const Reports=require("../models/Reports");
const updateModeration = require("../utils/updateModeration");

//videos

exports.getVideoById = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const video = await Videos.findOne({ _id: videoId, status: "active" });
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getVideoByChannelId = async (req, res) => {
  const channelId = req.params.channelId;
  try {
    const ChannelVideos = await Videos.find({
      ownerId: channelId,
      status: "active",
    });
    res.json(ChannelVideos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getVideoByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const CategoryVideos = await Videos.find({
      category: category,
      status: "active",
    });
    res.json(CategoryVideos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.createVideo = async (req, res) => {
  const { title, description, category, thumbnailUrl, videoUrl } = req.body;
  try {
    const video = await Videos.create({
      title: title,
      description: description,
      category: category,
      thumbnailUrl: thumbnailUrl,
      videoUrl: videoUrl,
      ownerId: req.userId,
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteVideo = async (req, res) => {
  const videoId = req.params.videoId;
  console.log("deleteVideo");

  try {
    const videoAvailable = await Videos.findOne({ _id: videoId });
    if (!videoAvailable)
      return res.status(404).json({ error: "Video not found" });
    if (!videoAvailable.ownerId.equals(req.userId)) {
      return res.sendStatus(403);
    }
    await Videos.deleteOne({ _id: videoId });
    await Comments.deleteMany({ videoId: videoId });
    await CommentsLikes.deleteMany({ videoId: videoId });
    await VideosLikes.deleteMany({ videoId: videoId });
    await Reports.deleteMany({
    targetType: "video",
    targetId: videoId,
});
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

//comment
exports.addComment = async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.userId;
  const commentText = req.body.commentText;

  try {
    const video = await Videos.findOne({
      _id: videoId,
      status: "active",
    });

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }
    const comment = await Comments.create({
      videoId: videoId,
      userId: userId,
      commentText: commentText,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  console.log("deleteComment");

  const userId = req.userId;
  const commentId = req.params.commentId;
  try {
    const commentAvailable = await Comments.findOne({
      _id: commentId,
      status: "active",
    });
    console.log(commentAvailable);
    if (!commentAvailable) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    if (!commentAvailable.userId.equals(req.userId)) {
      return res.status(403).json({
        error: "Cannot delete others comments",
      });
    }
    await Comments.deleteOne({ _id: commentId });
    await CommentsLikes.deleteMany({ commentId: commentId });
    await Reports.deleteMany({
    targetType: "comment",
    targetId: commentId,
});
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getAllCommentsByVideoId = async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const comments = await Comments.find({
      videoId: videoId,
      status: "active",
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.editComment = async (req, res) => {
  //updated time in mongodb
  const commentText = req.body.commentText;
  const commentId = req.params.commentId;
  try {
    const commentAvailable = await Comments.findOne({
      _id: commentId,
      status: "active",
    });
    if (!commentAvailable) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    if (!commentAvailable.userId.equals(req.userId)) {
      return res.status(404).json({
        error: "Cannot delete others comments",
      });
    }
    const updatedComment = await Comments.findByIdAndUpdate(
      commentId,
      { commentText },
      { new: true },
    );
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
//Subscriptions

exports.addSubscriptions = async (req, res) => {
  const channelId = req.params.channelId;
  const userId = req.userId;

  try {
    if (channelId.equals(req.userId)) {
      return res
        .status(400)
        .json({ error: "Cannot subscribe to your own channel" });
    }

    if (
      await Subscribers.findOne({ channelId: channelId, subscriberId: userId })
    )
      return res.status(409).json({ error: "Channel already subscribed" });

    if (!(await Users.findById(channelId)))
      return res.status(404).json({ error: "Channel not found" });

    const subscription = await Subscribers.create({
      channelId: channelId,
      subscriberId: userId,
    });

    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  const userId = req.userId;
  try {
    const subscriptions = await Subscribers.find({ subscriberId: userId });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getAllSubscribersCount = async (req, res) => {
  const channelId = req.params.channelId;
  try {
    const channel = await Users.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        error: "Channel not found",
      });
    }
    const subscribers = await Subscribers.find({
      channelId: channelId,
    });
    // console.log(subscribers);
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteSubscriptions = async (req, res) => {
  console.log("deleteSubscriptions");
  const userId = req.userId;
  const channelId = req.params.channelId;
  try {
    const subscriptionAvailable = await Subscribers.findOne({
      channelId: channelId,
      subscriberId: userId,
    });
    // console.log(subscriptionAvailable);
    if (!subscriptionAvailable) {
      return res.sendStatus(404);
    }
    await Subscribers.deleteOne({ channelId: channelId, subscriberId: userId });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

//Likes
exports.getVideosLikesCount = async (req, res) => {
  const videoId = req.params.videoId;

  try {
    const video = await Videos.findOne({
      _id: videoId,
      status: "active",
    });

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }
    const videoLikes = await VideosLikes.find({
      videoId: videoId,
    });
    res.json(videoLikes);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.addVideoLike = async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.userId;

  try {
    const video = await Videos.findOne({
      _id: videoId,
      status: "active",
    });

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }
    const result = await VideosLikes.findOne({
      userId: userId,
      videoId: videoId,
    });
    if (result) {
      return res.status(409).json({
        error: "Video already liked",
      });
    }
    const videoLike = await VideosLikes.create({
      videoId: videoId,
      userId: userId,
    });
    res.status(201).json(videoLike);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.addCommentLike = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.userId;
  const videoId = req.params.videoId;

  try {
    const comment = await Comments.findOne({
      _id: commentId,
      status: "active",
    });

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    const result = await CommentsLikes.findOne({
      commentId: commentId,
      userId: userId,
    });
    if (result) {
      return res.status(409).json({
        error: "Comment already liked",
      });
    }
    const commentLike = await CommentsLikes.create({
      commentId: commentId,
      userId: userId,
      videoId: videoId,
    });
    res.status(201).json(commentLike);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteVideoLike = async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.userId;
  try {
    const likesAvailable = await VideosLikes.findOne({
      videoId: videoId,
      userId: userId,
    });
    if (!likesAvailable) {
      return res.sendStatus(404);
    }
    await VideosLikes.deleteOne({ videoId: videoId, userId: userId });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteCommentLike = async (req, res) => {
  console.log("deleteCommentLike fired");
  console.log("params:", req.params);
  console.log("userId:", req.userId);
  const commentId = req.params.commentId;
  const userId = req.userId;
  try {
    const commentsLikesAvailable = await CommentsLikes.findOne({
      commentId: commentId,
      userId: userId,
    });
    console.log(commentsLikesAvailable);
    if (!commentsLikesAvailable) {
      return res.sendStatus(404);
    }
    await CommentsLikes.deleteOne({ commentId: commentId, userId: userId });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getCommentsLikesCount = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comments.findOne({
      _id: commentId,
      status: "active",
    });

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    const likes = await CommentsLikes.find({
      commentId: commentId,
    });
    res.json(likes);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
//report

exports.reportVideo=async (req,res)=>{
  const videoId=req.params.videoId;
  const {reason}=req.body;
  try {
    const video =await Videos.findById(videoId);
    if (!video){
      return res.status(404).json({
        error: "Video not found",
      });
    }
    if (video.status === "removed") {
  return res.status(400).json({
    error: "Video has already been removed",
  });
}
    const targetId= video.ownerId
    const reports =await Reports.create({
      reason:reason,
      targetId:targetId,
      targetContentId:videoId,
      targetType:"video",
      reporterId:req.userId,
    })
     await updateModeration("video",videoId)
    res.status(201).json(reports);
    
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
exports.reportComment=async (req,res)=>{
  const commentId=req.params.commentId;
  const {reason}=req.body;
  try {
    const comment =await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

if (comment.status === "removed") {
  return res.status(400).json({
    error: "Comment has already been removed",
  });
}
    const targetId= comment.userId
    const reports =await Reports.create({
      reason:reason,
      targetId:targetId,
      targetContentId:commentId,
      targetType:"comment",
      reporterId:req.userId,
    })
    await updateModeration("comment",commentId)
    res.status(201).json(reports);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
