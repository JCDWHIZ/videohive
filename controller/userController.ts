import { Request, Response } from "express";
import { User } from "../models/User";

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.params.username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }
    const user = await User.findOne({
      username: req.params.username,
    }).select("-passwordHash -role -email -createdAt");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const updateAvatar = async (req: Request, res: Response) => {};

export const updateCover = async (req: Request, res: Response) => {};

export const getMe = async (req: Request, res: Response) => {};
export const getFollowers = async (req: Request, res: Response) => {};
export const getFollowing = async (req: Request, res: Response) => {};

// ===============================
// Follow Endpoints
// ===============================

export const followUser = async (req: any, res: Response) => {
  try {
    const TaiwoId = req.user.id;
    const { DavidId } = req.params;

    if (!DavidId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const David = await User.findById(DavidId);

    if (!David) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const Taiwo = await User.findById(TaiwoId);

    if (!Taiwo) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // user.Followers.push(DavidId);
    // user.followingCount += 1;
    // await user.save();

    David.Followers.push(TaiwoId);
    Taiwo.Following.push(DavidId);
    David.followersCount += 1;
    Taiwo.followingCount += 1;
    await David.save();
    await Taiwo.save();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {};
