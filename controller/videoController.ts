import { Response } from "express";
import { User } from "../models/User";
import { Video } from "../models/Video";
import { VideoComment } from "../models/Comments";

export const uploadVideoDetails = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { url, publicId, duration, caption, visibility } = req.body;

    const newVideo = await Video.create({
      userId,
      caption,
      video: { url, publicId, duration },
      visibility,
    });

    return res.status(201).json({
      message: "Video details uploaded successfully",
      data: newVideo,
    });
  } catch (error) {
    console.error("Error uploading video details:", error);
    res.status(500).json({ error: "Failed to upload video details" });
  }
};

export const getVideoFeed = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const currentUserId = req.user?.id;
    let followingIds: string[] = [];

    if (currentUserId) {
      const currentUser =
        await User.findById(currentUserId).select("Following");

      if (currentUser?.Following?.length) {
        followingIds = currentUser.Following.map((followingId) =>
          followingId.toString(),
        );
      }
    }

    const videos = await Video.find({
      visibility: "public",
      status: "published",
    })
      .select(
        "userId caption video visibility status likesCount commentsCount viewsCount createdAt",
      )
      .lean();

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos available" });
    }

    const now = Date.now();
    const rankedVideos = videos
      .map((video) => {
        const createdAt = new Date(video.createdAt).getTime();
        const ageInHours = Math.max((now - createdAt) / (1000 * 60 * 60), 1);
        const recencyScore = 24 / ageInHours;
        const engagementScore =
          (video.likesCount || 0) * 3 +
          (video.commentsCount || 0) * 2 +
          (video.viewsCount || 0) * 0.2;
        const followBoost = followingIds.includes(video.userId.toString())
          ? 50
          : 0;
        const ownerBoost =
          currentUserId && video.userId.toString() === currentUserId ? 15 : 0;

        return {
          ...video,
          score: followBoost + ownerBoost + recencyScore + engagementScore,
        };
      })
      .sort((firstVideo, secondVideo) => {
        if (secondVideo.score !== firstVideo.score) {
          return secondVideo.score - firstVideo.score;
        }

        return (
          new Date(secondVideo.createdAt).getTime() -
          new Date(firstVideo.createdAt).getTime()
        );
      });

    const total = rankedVideos.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedVideos = rankedVideos.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      message: "Video feed fetched successfully",
      data: paginatedVideos,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      ranking: {
        strategy: "following + recency + engagement",
        personalized: Boolean(currentUserId),
      },
    });
  } catch (error) {
    console.error("Error fetching video feed:", error);
    res.status(500).json({ error: "Failed to fetch video feed" });
  }
};

export const getUserVideos = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * limit;
    const videoQuery: any = {
      userId,
      visibility: "public",
      status: "published",
    };
    const total = await Video.countDocuments(videoQuery);

    if (total === 0) {
      return res.status(404).json({ message: "No videos found for this user" });
    }

    const videos = await Video.find(videoQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      message: "User videos fetched successfully",
      data: videos,
      meta: { total, page, limit, totalPages },
    });
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res.status(500).json({ error: "Failed to fetch user videos" });
  }
};

export const updateVideoDetails = async (req: any, res: Response) => {
  try {
    const { videoId } = req.params;
    const { caption, visibility } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    if (video.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this video" });
    }
    if (caption !== undefined) video.caption = caption;
    if (visibility !== undefined) video.visibility = visibility;
    await video.save();

    return res.status(200).json({
      message: "Video details updated successfully",
    });
  } catch (error) {
    console.error("Error updating video details:", error);
    res.status(500).json({ error: "Failed to update video details" });
  }
};

export const deleteVideo = async (req: any, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    if (video.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this video" });
    }
    await video.deleteOne();

    return res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
};

export const likeVideo = async (req: any, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.likesCount = (video.likesCount || 0) + 1;
    await video.save();
    return res.status(200).json({
      message: "Video liked successfully",
    });
  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ error: "Failed to like video" });
  }
};

export const unlikeVideo = async (req: any, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    // Ensure likesCount doesn't go below 0
    video.likesCount = Math.max((video.likesCount || 1) - 1, 0);
    await video.save();
    return res.status(200).json({
      message: "Video unliked successfully",
    });
  } catch (error) {
    console.error("Error unliking video:", error);
    res.status(500).json({ error: "Failed to unlike video" });
  }
};

export const addComments = async (req: any, res: Response) => {
  try {
    const { videoId } = req.params;
    const { message } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comment = await VideoComment.create({
      userId: req.user.id,
      videoId,
      text: message,
    });

    video.commentsCount = (video.commentsCount || 0) + 1;
    await video.save();

    return res.status(201).json({
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getVideoComments = async (req: any, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const comments = await VideoComment.find({ videoId })
      .sort({
        createdAt: -1,
      })
      // .populate("parentCommentId", "text userId createdAt likesCount")
      .populate("userId", "username avatar");

    return res.status(200).json({
      message: "Video comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching video comments:", error);
    res.status(500).json({ error: "Failed to fetch video comments" });
  }
};
export const updateComment = async (req: any, res: Response) => {
  try {
    const { videoId, commentId } = req.params;
    const { message } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comment = await VideoComment.findOne({ _id: commentId, videoId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this comment" });
    }

    comment.text = message;
    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

export const deleteComment = async (req: any, res: Response) => {
  try {
    const { videoId, commentId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comment = await VideoComment.findOne({ _id: commentId, videoId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    await comment.deleteOne();
    video.commentsCount = Math.max((video.commentsCount || 1) - 1, 0);
    await video.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

export const replyToComment = async (req: any, res: Response) => {
  try {
    const { videoId, commentId } = req.params;
    const { message } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const parentComment = await VideoComment.findOne({
      _id: commentId,
      videoId,
    });

    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const replyComment = await VideoComment.create({
      userId: req.user.id,
      videoId,
      parentCommentId: commentId,
      text: message,
    });

    return res.status(201).json({
      message: "Reply added successfully",
    });
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ error: "Failed to reply to comment" });
  }
};
