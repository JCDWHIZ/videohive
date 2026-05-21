import { Request, Response } from "express";
import { Readable } from "stream";
import path from "path";
import cloudinary from "../config/cloudinaryConfig";

export const singleImageUpload = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imagePath = path.resolve(__dirname, "../uploads", req.file.filename);
    console.log(`Resolved image path: ${imagePath}`);

    const result = await cloudinary.uploader.upload(imagePath);

    res.json({
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error });
  }
};
const uploadToCloudinary = (
  fileBuffer: Buffer,
  options: {
    resource_type: "image" | "video";
  },
) => {
  return new Promise((resolve, reject) => {
    const cloudinaryStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(cloudinaryStream);
  });
};

export const singleVideoUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: "video",
    });

    return res.json({
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error });
  }
};
