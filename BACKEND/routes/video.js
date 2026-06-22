const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateaccessToken");

const {
  getVideoById,
  getVideoByChannelId,
  getVideoByCategory,
  createVideo,
  deleteVideo,

  addSubscriptions,
  deleteSubscriptions,
  getAllSubscribersCount,
  getAllSubscriptions,

  addComment,
  deleteComment,
  getAllCommentsByVideoId,

  editComment,

  getVideosLikesCount,
  getCommentsLikesCount,
  addVideoLike,
  addCommentLike,
  deleteVideoLike,
  deleteCommentLike,
} = require("../controllers/videoController");
router.get("/test", (req, res) => {
  res.send("Video router working");
});

router.post("/create", authenticateToken, createVideo);
router.get("/watch/:videoId", getVideoById);
router.get("/channel/:channelId", getVideoByChannelId);
router.get("/channel/:channelId/subscribers", getAllSubscribersCount);
router.get("/subscriptions", authenticateToken, getAllSubscriptions);
router.get("/:videoId/comments", getAllCommentsByVideoId);
router.get("/:videoId/likes", getVideosLikesCount);
router.get("/:videoId/comments/:commentId/likes", getCommentsLikesCount);
router.get("/:category", getVideoByCategory);

router.post("/:videoId/likes/add", authenticateToken, addVideoLike);
router.post("/:videoId/comments/create", authenticateToken, addComment);
router.post("/:videoId/comments/:commentId/likes/add", authenticateToken, addCommentLike);
router.post("/channel/:channelId/subscribe/add", authenticateToken, addSubscriptions);

router.patch("/:videoId/comments/:commentId/edit",authenticateToken,editComment);

router.delete("/channel/:channelId/subscribe/delete", authenticateToken ,deleteSubscriptions);
router.delete("/:videoId/comments/:commentId/likes/delete", authenticateToken, deleteCommentLike);
router.delete("/:videoId/comments/:commentId/delete", authenticateToken, deleteComment);
router.delete("/:videoId/likes/delete", authenticateToken, deleteVideoLike);
router.delete("/:videoId", authenticateToken, deleteVideo);




module.exports = router;
