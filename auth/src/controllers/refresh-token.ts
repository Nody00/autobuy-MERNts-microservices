import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refresh-token";
import { TokenHelper } from "../helpers/tokens";
import { User } from "../models/user";

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.session?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    // Verify the refresh token
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET!
    ) as { userId: string };

    // Check if refresh token exists in database
    const savedToken = await RefreshToken.findOne({
      userId: payload.userId,
      token: refreshToken,
      expiresAt: { $gt: new Date() },
    });

    if (!savedToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Get user and generate new access token
    const user = await User.findById(payload.userId).populate("role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = TokenHelper.generateAccessToken({
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      // @ts-ignore
      permissions: user.role.permissions,
    });

    // Update session
    req.session = {
      ...req.session,
      jwt: accessToken,
    };

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
