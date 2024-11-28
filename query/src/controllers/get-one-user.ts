import { Request, Response } from "express";
import { User } from "../models/user";
import { validationResult } from "express-validator";

interface RequestParams {
  id: string;
}

export const getOneUserController = async (
  req: Request<RequestParams, {}, {}>,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  try {
    const user = await User.findOne({
      _id: id,
      deleted: { $ne: true },
    }).populate({
      path: "saves",
    });

    if (!user) {
      return res.status(404).send({ message: "No such user found!" });
    }

    // Send successful response with user data
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // Error handling
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
