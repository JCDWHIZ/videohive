import express from "express";

import { protectRoute } from "../middlewares/authMiddleware";
import {
  getFollowers,
  getFollowing,
  getMe,
  getProfile,
  updateAvatar,
  updateCover,
  followUser,
  unfollowUser,
} from "../controller/userController";
const router = express.Router();

router.get("/:username", getProfile);
router.put("/profile", protectRoute, getProfile);
router.put("/me/avatar", protectRoute, updateAvatar);
router.put("/me/cover", protectRoute, updateCover);
router.get("/me", protectRoute, getMe); // used for user to get all video both public and private videos
router.get("/:userId/followers", protectRoute, getFollowers);
router.get("/:userId/following", protectRoute, getFollowing);
router.post("/:userId/follow", protectRoute, followUser);
router.delete("/:userId/unfollow", protectRoute, unfollowUser);

module.exports = router;
