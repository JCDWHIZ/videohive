import { Response } from "express";
import { Video } from "../models/Video";

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
