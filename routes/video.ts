// would need to add endpoint for video status changes

import express from "express";
import { uploadVideoDetails } from "../controller/videoController";
import { protectRoute } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/upload", protectRoute, uploadVideoDetails);

module.exports = router;
