import { Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinaryConfig";

export const singleUpload = async (req: any, res: Response) => {
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
