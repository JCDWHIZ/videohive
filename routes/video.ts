// would need to add endpoint for video status changes

import express from "express";
import {
  uploadVideoDetails,
  deleteVideo,
  getUserVideos,
  getVideoFeed,
  updateVideoDetails,
  likeVideo,
  unlikeVideo,
  addComments,
  getVideoComments,
  deleteComment,
  replyToComment,
  updateComment,
} from "../controller/videoController";
import { protectRoute } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/upload", protectRoute, uploadVideoDetails);

router.get("/feed", getVideoFeed);

router.get("/video/:userId", protectRoute, getUserVideos);
router.patch("/video/:videoId", protectRoute, updateVideoDetails);

router.delete("/video/:videoId", protectRoute, deleteVideo);

router.post("/video/:videoId/like", protectRoute, likeVideo);

router.post("/video/:videoId/unlike", protectRoute, unlikeVideo);

router.post("/video/:videoId/comments", protectRoute, addComments);

router.get("/video/:videoId/comments", getVideoComments);

router.patch(
  "/video/:videoId/comments/:commentId",
  protectRoute,
  updateComment,
);

router.delete(
  "/video/:videoId/comments/:commentId",
  protectRoute,
  deleteComment,
);

router.post(
  "/video/:videoId/comments/:commentId/replies",
  protectRoute,
  replyToComment,
);
module.exports = router;
