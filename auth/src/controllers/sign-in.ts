import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import { Password } from "../helpers/Password";
import jwt from "jsonwebtoken";

interface SignInRequestBody {
  email: string;
  password: string;
}

export const signInController = async (
  req: Request<{}, {}, SignInRequestBody>,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const fetchedUser = await User.findOne({ email });

  if (!fetchedUser) {
    return res.status(400).json({ message: "Invalid email or password!" });
  }

  try {
    const passwordEqual = await Password.comparePasswords(
      password,
      fetchedUser.password
    );

    if (!passwordEqual) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server Error!" });
  }

  const token = jwt.sign(
    {
      ...fetchedUser,
      password: undefined,
    },
    process.env.JWT_SECRET! as string,
    { expiresIn: "1h" }
  );

  req.session = { jwt: token };

  return res.status(200).json({
    message: "Login successful!",
    user: {
      _id: fetchedUser._id.toString(),
      email: fetchedUser.email,
      firstName: fetchedUser.firstName,
      lastName: fetchedUser.lastName,
      phoneNumber: fetchedUser.phoneNumber,
    },
  });
};
