import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { RefreshToken } from "../models/refresh-token";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export class TokenHelper {
  static generateAccessToken(user: User) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" } // Short lived token
    );
  }

  static async generateRefreshToken(userId: string) {
    const token = jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET!, {
      expiresIn: "7d",
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = new RefreshToken({
      userId,
      token,
      expiresAt,
    });

    await refreshToken.save();

    return token;
  }
}
