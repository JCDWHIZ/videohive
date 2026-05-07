import mongoose, { model, Schema } from "mongoose";

const videoLikesSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const VideoLike = model("VideoLike", videoLikesSchema);
