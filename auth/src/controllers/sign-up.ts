import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import { rabbit } from "../service/RabbitMQService";

import { Password } from "../helpers/Password";

interface SignUpRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
export const signUpController = async (
  req: Request<{}, {}, SignUpRequestBody>,
  res: Response
) => {
  // handle the errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, phoneNumber } = req.body;
  // logic for creating user

  const hashedPassword = await Password.hashPassword(password);

  const newUser = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phoneNumber,
  };

  // check if user with email already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (existingUser && existingUser._id) {
    return res
      .status(400)
      .json({ message: "Email or phone number already in use!" });
  }

  try {
    const result = new User(newUser);
    await result.save();
  } catch (error) {
    console.log("DB error on user creation", error);
    return res.status(500).send({ message: "Could not create user!" });
  }

  // send a message to the query service
  rabbit.sendMessage("auth-events", "users.new", newUser);
  return res.status(201).send({ message: "User created" });
};
