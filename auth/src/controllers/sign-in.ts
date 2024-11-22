import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import { Password } from "../helpers/Password";
import { TokenHelper } from "../helpers/tokens";

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

  const fetchedUser = await User.findOne({ email }).populate("role");

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

  // Generate both tokens, access token is the short lived 15min token, the refresh token is the longer 7day refresh token
  const accessToken = TokenHelper.generateAccessToken({
    _id: fetchedUser._id.toString(),
    email: fetchedUser.email,
    firstName: fetchedUser.firstName,
    lastName: fetchedUser.lastName,
    phoneNumber: fetchedUser.phoneNumber,
    ...(fetchedUser.isAdmin && { isAdmin: true }),
    ...(fetchedUser.isCustomer && { isCustomer: true }),
    // @ts-ignore
    permissions: fetchedUser.role.permissions,
  });

  const refreshToken = await TokenHelper.generateRefreshToken(
    fetchedUser._id.toString()
  );

  req.session = { jwt: accessToken, refreshToken: refreshToken };

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
