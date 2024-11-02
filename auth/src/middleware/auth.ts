import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.session?.jwt;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Only verify token signature and expiration
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Add user info to request
    // @ts-ignore
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
