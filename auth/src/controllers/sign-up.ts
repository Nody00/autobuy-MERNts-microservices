import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import { rabbit } from "../service/RabbitMQService";
import { Role } from "../models/roles";
import { Password } from "../helpers/Password";

interface SignUpRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
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

  const { email, password, firstName, lastName, phoneNumber, isAdmin } =
    req.body;

  // check if user with email already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (existingUser && existingUser._id) {
    return res
      .status(400)
      .json({ message: "Email or phone number already in use!" });
  }

  const hashedPassword = await Password.hashPassword(password);

  const userRole = await Role.findOne({ name: isAdmin ? "Admin" : "User" });

  if (!userRole) {
    return res.status(500).send({ message: "Default role not found!" });
  }
  const newUser = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phoneNumber,
    role: userRole._id,
    version: 1,
    ...(isAdmin && { isAdmin: true, isCustomer: false }),
    ...(!isAdmin && { isCustomer: true, isAdmin: false }),
  };

  try {
    const result = new User(newUser);
    await result.save();

    const foundUser = await User.findById(result._id);

    // send a message to the query service
    rabbit.sendMessage("auth-events", "users.new", {
      ...foundUser?.toObject(),
      operation: "create",
    });
    return res.status(201).send({ message: "User created", data: result });
  } catch (error) {
    console.log("DB error on user creation", error);
    return res.status(500).send({ message: "Could not create user!" });
  }
};
