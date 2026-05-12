import { Request, Response } from "express";
import { RegisterUserRequest } from "../types/requests/authRequests";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  if (!process.env.JWT_SECRET_KEY) {
    return res.status(500).json({
      message: "JWT secret key is not defined in the environment variables",
    });
  }
  const { username, email, password, fullName } =
    req.body as RegisterUserRequest;

  // add validation

  if (!username || !email || !password || !fullName) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  console.log("hashed password", hashedPassword, "original password", password);
  // save the user to the database

  const user = await User.create({
    username,
    email,
    passwordHash: hashedPassword,
    fullName,
  });

  const token = jwt.sign(
    {
      email,
      username,
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  res.status(201).json({
    token,
    refreshToken,
    message: "User registered successfully",
  });
};

export const loginUser = async (req: Request, res: Response) => {
  if (!process.env.JWT_SECRET_KEY) {
    return res.status(500).json({
      message: "JWT secret key is not defined in the environment variables",
    });
  }
  const { email, password } = req.body;

  const exisitingUser = await User.findOne({ email });

  if (!exisitingUser) {
    return res.status(400).json({
      message: "User with this email does not exist",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    exisitingUser.passwordHash,
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      email,
      username: exisitingUser.username,
      userId: exisitingUser._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: exisitingUser._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    token,
    refreshToken,
    message: "Login successful",
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
    });
  }

  if (!process.env.JWT_SECRET_KEY) {
    return res.status(500).json({
      message: "JWT secret key is not defined in the environment variables",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const newToken = jwt.sign(
      {
        email: user.email,
        username: user.username,
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

export const logout = (req: Request, res: Response) => {};

export const getMe = (req: Request, res: Response) => {};
