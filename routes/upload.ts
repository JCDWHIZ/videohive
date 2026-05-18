import express from "express";
import { upload } from "../config/multerConfig";
import { singleUpload } from "../controller/uploadController";

const router = express.Router();

// Single file upload
// router.route("/single").post(upload.single("image"), singleUpload);

// // Multiple files upload
// router.route("/multiple").post(upload.array("files", 5), multipleUploads);

// // Multiple fields upload
// const multipleUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "gallery", maxCount: 5 },
// ]);

// router.route("/fields").post(multipleUpload, multipleFields);

// const router = express.Router();

// Wrap route with error handling middleware
// const handleMulterErrors = (req: any, res: Response, next: any) => {
//   return (err: any) => {
//     if (err) {
//       console.error(err.message);
//       res.status(400).json({ error: err.message });
//     } else {
//       next();
//     }
//   };
// };

// Single file upload
router.post("/single", upload.single("image"), singleUpload);

// // Multiple files upload
// router.post("/multiple", upload.array("files", 5), multipleUploads);

// // Multiple fields upload
// const multipleUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "gallery", maxCount: 5 },
// ]);
// router.post("/fields", multipleUpload, multipleFields);

module.exports = router;
