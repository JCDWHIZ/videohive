import express, { Application, Request, Response } from "express";
import { loginUser } from "../controller/authController";
const router = express.Router();

router.post("/login", loginUser);

module.exports = router;
