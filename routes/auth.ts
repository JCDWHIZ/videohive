import express, { Application, Request, Response } from "express";
import {
  loginUser,
  refreshToken,
  registerUser,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controller/authController";
import { protectRoute } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protectRoute, getMe);

module.exports = router;
