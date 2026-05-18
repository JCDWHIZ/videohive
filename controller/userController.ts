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
export const updateAvatar = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { url, publicId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.avatar = {
      publicId: publicId,
      url: url,
    };

    await user.save();

    return res.status(200).json({
      message: "Avatar updated succesfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateCover = async (req: Request, res: Response) => {};

export const getMe = async (req: Request, res: Response) => {};
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).populate(
      "Followers",
      "username avatar",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Followers retrieved successfully",
      followers: user.Followers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const getFollowing = async (req: Request, res: Response) => {};

// ===============================
// Follow Endpoints
// ===============================

export const followUser = async (req: any, res: Response) => {
  try {
    const TaiwoId = req.user.id;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const David = await User.findById(userId);

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
    Taiwo.Following.push(userId);
    David.followersCount += 1;
    Taiwo.followingCount += 1;
    await David.save();
    await Taiwo.save();

    return res.status(200).json({
      message: "User followed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const unfollowUser = async (req: any, res: Response) => {
  try {
    const TaiwoId = req.user.id;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const David = await User.findById(userId);

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

    // remove TaiwoId from David.Followers
    David.Followers = David.Followers.filter(
      (followerId) => followerId.toString() !== TaiwoId.toString(),
    );
    Taiwo.Following = Taiwo.Following.filter(
      (followingId) => followingId.toString() !== userId.toString(),
    );
    David.followersCount -= 1;
    Taiwo.followingCount -= 1;
    await David.save();
    await Taiwo.save();

    return res.status(200).json({
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
