const User = require("../models/User");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");
const VideosLikes = require("../models/VideosLikes");
const CommentsLikes = require("../models/CommentsLikes");
const Subscribers = require("../models/Subscribers");

//videos

exports.getVideoById = async (req, res) => {
  const videoId = req.params.videoId;
  //   console.log(videoId);
  try {
    const video = await Videos.findOne({ _id: videoId });
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
    const CategoryVideos = await Videos.find({ category: category });
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
    // console.log(videoAvailable);
    if (!videoAvailable) {
      return res.sendStatus(404);
    }
    if (!videoAvailable.ownerId.equals(req.userId)) {
      //   console.log(videoId);
      return res.sendStatus(403);
    }
    await Videos.deleteOne({ _id: videoId });
    await Comments.deleteMany({ videoId: videoId });
    await CommentsLikes.deleteMany({ videoId: videoId });
    await VideosLikes.deleteMany({ videoId: videoId });
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
    const commentAvailable = await Comments.findOne({ _id: commentId });
    console.log(commentAvailable);
    if (!commentAvailable) {
      return res.sendStatus(404);
    }
    if (!commentAvailable.userId.equals(req.userId)) {
      return res.sendStatus(403);
    }
    await Comments.deleteOne({ _id: commentId });
    await CommentsLikes.deleteMany({ commentId: commentId });
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
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.editComment=async (req,res)=>{
  const commentText = req.body.commentText;
  const commentId = req.params.commentId;
  try {
    const commentAvailable = await Comments.findOne({ _id: commentId });
     if (!commentAvailable) {
      return res.sendStatus(404);
    }
    if (!commentAvailable.userId.equals(req.userId)) {
      return res.sendStatus(403);
    }
    const updatedComment = await Comments.findByIdAndUpdate(commentId,{ commentText },{ new: true });
     res.json(updatedComment)
    
  } catch (err) {
    res.status(500).json({
      error: err.message,
  });
}

}
//Subscriptions

exports.addSubscriptions = async (req, res) => {
  const userId = req.userId;
  const channelId = req.params.channelId;
  try {
    const subscription = await Subscribers.create({
      channelId: channelId,
      subscriberId: userId,
    });
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  const userId = req.userId;
  try {
    const subscriptions = await Subscribers.find({ subscriberId: userId });
    // console.log(subscriptions);
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
    const result = await VideosLikes.findOne({
      userId: userId,
      videoId: videoId,
    });
    if (result) {
      return res.status(201).send("Video already liked");
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
    const result = await CommentsLikes.findOne({
      commentId: commentId,
      userId: userId,
    });
    if (result) {
      return res.status(404).send("Comment already liked");
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
