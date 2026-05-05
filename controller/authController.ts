import { Request, Response } from "express";

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  res.json({
    message: "login successful",
    email,
  });
};
