import { Request, Response } from "express";
import { RefreshToken } from "../models/refresh-token";

export const signOutController = async (req: Request, res: Response) => {
  const refreshToken = req.session?.refreshToken;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  req.session = null;

  return res.status(200).json({ message: "Sign out successful" });
};
