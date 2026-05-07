import mongoose, { model, Schema } from "mongoose";

const videoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      maxlength: 2200,
      trim: true,
    },
    video: {
      url: String,
      publicId: String,
      duration: Number,
      format: String,
      bytes: Number,
    },
    thumbnail: {
      url: String,
      publicId: String,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["processing", "published", "failed", "blocked"],
      default: "published",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Video = model("Video", videoSchema);
