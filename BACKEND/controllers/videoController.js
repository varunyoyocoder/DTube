const Users = require("../models/Users");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");
const VideosLikes = require("../models/VideosLikes");
const CommentsLikes = require("../models/CommentsLikes");
const Subscribers = require("../models/Subscribers");
const Reports = require("../models/Reports");
const updateModeration = require("../utils/updateModeration");
const VideoViews = require("../models/VideoViews");

exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const videos = await Videos.find({ status: "active" })
      .sort({
        likes: -1,
        views: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(videos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.searchVideos = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
        const { query } = req.query;
        if (!query || query.trim() === "") {
            return res.status(400).json({
                message: "Search query is required",
            });
        }
         const users = await Users.find({
            username: {
                $regex: query,
                $options: "i",
            },
        }).select("_id");
        const userIds = users.map(user => user._id);
        const videos = await Videos.find({
            $or: [
                {
                    title: {
                        $regex: query,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: query,
                        $options: "i",
                    },
                },
                {
                    ownerId: {
                        $in: userIds,
                    },
                },
            ],
        })
         .sort({
        likes: -1,
        views: -1,
        createdAt: -1 ,
      })
      .skip((page - 1) * limit)
      .limit(limit)
            .populate("ownerId", "username")
        res.status(200).json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to search videos",
        });
    }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const latestViews = await VideoViews.find({ userId })
      .sort({ viewedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const videos = await Promise.all(
      latestViews.map((view) => Videos.findById(view.videoId)),
    );
    res.json(videos.filter(Boolean));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getLikedVideos = async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  try {
    const videoLikes = await VideosLikes.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit);
    if (!videoLikes) {
      return res.status(404).json({
        error: "LikedVideos not found",
      });
    }
    const likedVideos = await Promise.all(
      videoLikes.map((like) => Videos.findById(like.videoId)),
    );
    res.json(likedVideos.filter(Boolean));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
 };
  



exports.getVideoById = async (req, res) => {
  const { videoId } = req.params;
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
    const previousView = await VideoViews.findOne({
      videoId,
      userId,
    });
    const oneHour = 60 * 60 * 1000;
    if (
      !previousView ||
      Date.now() - previousView.viewedAt.getTime() > oneHour
    ) {
      video.views += 1;
      await video.save();

      await VideoViews.findOneAndUpdate(
        { videoId, userId },
        {
          $set: {
            viewedAt: new Date(),
          },
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );
    }
    return res.status(200).json(video);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getVideoByChannelId = async (req, res) => {
  const { channelId } = req.params;
  const userId = req.userId;
  try {
    const channel = await Users.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        error: "Channel not found",
      });
    }
    const videos = await Videos.find({
      ownerId: channelId,
      status: "active",
    }).sort({
      createdAt: -1,
    });
    const subscribersCount = await Subscribers.countDocuments({
      channelId,
    });

    const isSubscribed = await Subscribers.findOne({
      subscriberId:userId,
      channelId:channelId,
    });

    res.status(200).json({
      username: channel.username,
      profileImage: channel.profileImageURL,
      videos,
      subscribersCount,
      isSubscribed: !!isSubscribed,
      isBanned:channel.isBanned
    });
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
    const result = await Promise.all(
      subscriptions.map(async (subscription) => {
        const channel = await Users.findById(subscription.channelId);
        const subscribers=await Subscribers.find({channelId:subscription.channelId})
        return {
          channelId: subscription.channelId,
          channelName: channel?.username,
          profileImage: channel?.profileImageURL,
          subscriberCount:subscribers?subscribers.length:0,
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

exports.getVideoByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const CategoryVideos = await Videos.find({
      category: category,
      status: "active",
    });
    res.status(200).json(CategoryVideos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.createVideo = async (req, res) => {
  const { title, description, category, thumbnailURL, videoURL } = req.body;
  try {
    const video = await Videos.create({
      title: title,
      description: description,
      category: category,
      thumbnailURL: thumbnailURL,
      videoURL: videoURL,
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
    const user = await Users.findById(userId);
    const comment = await Comments.create({
      videoId: videoId,
      userId: userId,
      commentText: commentText,
      username: user?.username,
    });
    const object = comment.toObject();

    object.likes = 0;
    object.userLiked = false;

    res.status(201).json(object);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  const userId = req.userId;
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
    if (!commentAvailable.userId.equals(req.userId) && req.user.role!=="admin") {
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
    res.status(200).json({message:"deleted message"});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getAllCommentsByVideoId = async (req, res) => {
  const { videoId } = req.params;

  try {
    const comments = await Comments.find({
      videoId,
      status: "active",
    });

    if (comments.length === 0) {
      return res.json([]);
    }

    const allLikes = await CommentsLikes.find({
      commentId: {
        $in: comments.map((comment) => comment._id),
      },
    });

    const likesMap = new Map();

    allLikes.forEach((like) => {
      const commentId = like.commentId.toString();

      if (!likesMap.has(commentId)) {
        likesMap.set(commentId, []);
      }

      likesMap.get(commentId).push(like);
    });

    const result = comments.map((comment) => {
      const commentLikes = likesMap.get(comment._id.toString()) || [];

      return {
        ...comment.toObject(),
        likes: commentLikes.length,
        userLiked: commentLikes.some((like) => like.userId.equals(req.userId)),
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
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
    if (channelId == req.userId) {
      return res
        .status(400)
        .json({ error: "Cannot subscribe to your own channel" });
    }
    const result = await Subscribers.findOne({
      channelId: channelId,
      subscriberId: userId,
    });
    if (result) {
      return res.status(409).json({ error: "Channel already subscribed" });
    }
    const channelExists = await Users.findById(channelId);
    if (!channelExists) {
      return res.status(404).json({ error: "Channel not found" });
    }
    const subscription = await Subscribers.create({
      channelId: channelId,
      subscriberId: userId,
    });
    res.status(201).json(subscription);
  } catch (err) {
    console.error(err);
  res.status(500).json({
    error: err.message,
  });
  }
};

exports.getAllSubscribers = async (req, res) => {
  const channelId = req.params.channelId;
  try {
    const channel = await Users.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        error: "Channel not found",
      });
    }
    const userSubscribed = await Subscribers.findOne({
      channelId: channelId,
      subscriberId: req.userId,
    });

    const subscribers = await Subscribers.find({
      channelId: channelId,
    });
    res.status(200).json({
      subscribers: subscribers,
      userSubscribed: userSubscribed ? true : false,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteSubscriptions = async (req, res) => {
  const userId = req.userId;
  const channelId = req.params.channelId;
  try {
    const subscriptionAvailable = await Subscribers.findOne({
      channelId: channelId,
      subscriberId: userId,
    });
    if (!subscriptionAvailable) {
      return res.sendStatus(404);
    }
    await Subscribers.deleteOne({ channelId: channelId, subscriberId: userId });
    res.status(200).json({messsage:"subscription deleted"});
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

//Likes
exports.getVideosLikes = async (req, res) => {
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
    const user = await VideosLikes.findOne({
      videoId: videoId,
      userId: req.userId,
    });
    res.json({ likes: videoLikes, userLiked: user ? true : false });
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
    console.error(err);
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
  const commentId = req.params.commentId;
  const userId = req.userId;
  try {
    const commentsLikesAvailable = await CommentsLikes.findOne({
      commentId: commentId,
      userId: userId,
    });
  
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

exports.getCommentsLikes = async (req, res) => {
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

exports.reportVideo = async (req, res) => {
  const videoId = req.params.videoId;
  const { reason } = req.body;
  try {
    const video = await Videos.findById(videoId);
    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }
    if (video.status === "removed") {
      return res.status(400).json({
        error: "Video has already been removed",
      });
    }
    const targetId = video.ownerId;
    const reports = await Reports.create({
      reason: reason,
      targetId: targetId,
      targetContentId: videoId,
      targetType: "video",
      reporterId: req.userId,
    });
    await updateModeration("video", videoId);
    res.status(201).json(reports);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.reportComment = async (req, res) => {
  const commentId = req.params.commentId;
  const { reason } = req.body;
  try {
    const comment = await Comments.findById(commentId);
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
    const targetId = comment.userId;
    const reports = await Reports.create({
      reason: reason,
      targetId: targetId,
      targetContentId: commentId,
      targetType: "comment",
      reporterId: req.userId,
    });
    await updateModeration("comment", commentId);
    res.status(201).json(reports);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
