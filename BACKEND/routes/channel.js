const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  changeProfilePicture,
  removeProfilePicture,
  createVideo,
  deleteVideo,

} = require("../controllers/channelController");

router.patch("/changeProfilePicture", upload.single("profileImage"), changeProfilePicture);
router.patch("/removeProfilePicture", removeProfilePicture);
router.post(
  "/createVideo",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createVideo,
);
router.post("/:videoId/delete", deleteVideo);

module.exports = router;
