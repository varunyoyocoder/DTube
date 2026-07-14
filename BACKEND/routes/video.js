const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateaccessToken");

const {
  getAllVideos,
  getVideoById,
  getVideoByChannelId,
  getVideoByCategory,
  getHistory,
  getLikedVideos,
  addComment,
  deleteComment,
  deleteVideo,
  addVideoLike,
  deleteVideoLike,
  addCommentLike,
  deleteCommentLike,
  addSubscriptions,
  deleteSubscriptions,
  reportVideo,
  searchVideos,
  
  getAllSubscribers,
  getAllSubscriptions,
  getVideosLikes,

  getAllCommentsByVideoId,
  editComment,
  reportComment,
  getCommentsLikes,
} = require("../controllers/videoController");
router.get("/test", (req, res) => {
  res.send("Video router working");
});

router.get("/", getAllVideos);
router.get("/history", getHistory);
router.get("/liked", getLikedVideos);
router.get("/search", searchVideos);

router.get("/channel/:channelId", getVideoByChannelId);
router.get("/channel/:channelId/subscribers", getAllSubscribers);
router.get("/subscriptions", getAllSubscriptions);
router.get("/:videoId/comments", getAllCommentsByVideoId);
router.post("/:videoId/report", reportVideo);
router.get("/:videoId/likes", getVideosLikes);
router.get("/:videoId/comments/:commentId/likes", getCommentsLikes);
router.get("/:videoId", getVideoById);
router.get("/category/:category", getVideoByCategory);

router.post("/:videoId/likes/add",  addVideoLike);
router.post("/:videoId/comments/add", addComment);
router.post(
  "/:videoId/comments/:commentId/likes/add",
  addCommentLike,
);
router.post(
  "/channel/:channelId/subscribe/add",
  addSubscriptions,
);

router.patch(
  "/:videoId/comments/:commentId/edit",
  editComment,
);
router.post(
  "/:videoId/comments/:commentId/report",
  reportComment,
);
router.post("/:videoId/report", reportVideo);

router.delete(
  "/channel/:channelId/subscribe/delete",
  deleteSubscriptions,
);
router.delete(
  "/:videoId/comments/:commentId/likes/delete",
  deleteCommentLike,
);
router.delete(
  "/:videoId/comments/:commentId/delete",
  deleteComment,
);
router.delete("/:videoId/likes/delete", deleteVideoLike);
router.delete("/:videoId", deleteVideo);

module.exports = router;
