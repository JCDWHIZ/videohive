import express, { Application, Request, Response } from "express";
import {
  loginUser,
  refreshToken,
  registerUser,
  logout,
  getMe,
} from "../controller/authController";
import { protectRoute } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

module.exports = router;
