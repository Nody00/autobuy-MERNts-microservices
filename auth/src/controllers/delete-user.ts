import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import { rabbit } from "../service/RabbitMQService";

interface RequestParams {
  id: string;
}

export const deleteUserController = async (
  req: Request<RequestParams, {}, {}>,
  res: Response
) => {
  // handle the errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndUpdate(
      id,
      {
        deleted: true,
        inc: { version: 1 },
      },
      {
        new: true,
        lean: true,
      }
    );

    rabbit.sendMessage("auth-events", "users.delete", {
      ...deletedUser,
      operation: "delete",
    });

    return res.status(200).send({ message: "User updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};
