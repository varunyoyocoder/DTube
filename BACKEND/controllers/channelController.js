// const Users = require("../models/Users");
// const Videos = require("../models/Videos");
// const Comments = require("../models/Comments");
// const VideosLikes = require("../models/VideosLikes");
// const CommentsLikes = require("../models/CommentsLikes");
// const Reports = require("../models/Reports");
// const updateModeration = require("../utils/updateModeration");

// //videos

// exports.changeProfilePicture = async (req, res) => {
//   console.log("In change profile");
//   const { profileImage } = req.file.path;
//   console.log(profileImage);
//   if (!profileImage) {
//     return res.status(400).json({
//       error: "Profile image is required",
//     });
//   }
//   try {
//     const user = await Users.findByIdAndUpdate(
//       req.userId,
//       {
//         profileImage: profileImage,
//       },
//       {
//         new: true,
//       },
//     );

//     if (!user) {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     }

//     res.status(200).json({
//       message: "Profile picture updated",
//       profileImage: user.profileImage,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// exports.createVideo = async (req, res) => {
//   const { title, description, category, thumbnailUrl, videoUrl } = req.body;
//   try {
//     const video = await Videos.create({
//       title: title,
//       description: description,
//       category: category,
//       thumbnailUrl: thumbnailUrl,
//       videoUrl: videoUrl,
//       ownerId: req.userId,
//     });
//     res.status(200).json({ message: "Video created" });
//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// exports.deleteVideo = async (req, res) => {
//   const videoId = req.params.videoId;
//   console.log("deleteVideo");

//   try {
//     const videoAvailable = await Videos.findOne({ _id: videoId });
//     if (!videoAvailable)
//       return res.status(404).json({ error: "Video not found" });
//     if (!videoAvailable.ownerId.equals(req.userId)) {
//       return res
//         .status(403)
//         .json({ error: "Cannot delete other users videos" });
//     }
//     await Videos.deleteOne({ _id: videoId });
//     await Comments.deleteMany({ videoId: videoId });
//     await CommentsLikes.deleteMany({ videoId: videoId });
//     await VideosLikes.deleteMany({ videoId: videoId });
//     await Reports.deleteMany({
//       targetType: "video",
//       targetId: videoId,
//     });
//     res.status(200).json({ message: "Video deleted" });
//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };
