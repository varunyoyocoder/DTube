const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateaccessToken");
const adminToken = require("../middleware/isAdmin");

const {
  getDashboard,//
   getUsers,
   getUserById,
    updateUser, 
    deleteUser,  
     getVideos,
      getVideoById,
       updateVideo,//merge with videostatus
        deleteVideo,
         updateVideoStatus,
         getCommentById,
           deleteComment,
           getComments,
           updateComment,
           updateCommentStatus,
           getReports,
            resolveReport,
} = require("../controllers/adminController");
router.get("/dashboard", getDashboard);

// Users
router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId",updateUser);
router.delete("/users/:userId", deleteUser);

// Videos
router.get("/videos", getVideos);
router.get("/videos/:videoId", getVideoById);
router.patch("/videos/:videoId", updateVideo);
router.patch("/videos/:videoId/status", updateVideoStatus);
router.delete("/videos/:videoId", deleteVideo);

// Comments,
router.get("/comments", getComments);
router.get("/comments/:commentId", getCommentById);
router.patch("/comments/:commentId", updateComment);
router.patch("/comments/:commentId/status", updateCommentStatus);
router.delete("/comments/:commentId", deleteComment);

// Reports
router.get("/reports", getReports);
router.patch("/reports/:reportId", resolveReport);

module.exports = router;