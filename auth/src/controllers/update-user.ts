import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";

interface RequestBody {
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  phoneNumber: string | undefined;
  recoveryPhoneNumber: string | undefined;
}

interface RequestParams {
  id: string;
}

export const updateUserController = async (
  req: Request<RequestParams, {}, RequestBody>,
  res: Response
) => {
  // handle the errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).send({ message: "User not found!" });
    }

    const { email, firstName, lastName, phoneNumber, recoveryPhoneNumber } =
      req.body;

    const userData: any = {};

    if (email) {
      userData.email = email;
      userData.emailVerified = false;
    }

    if (firstName) {
      userData.firstName = firstName;
    }

    if (lastName) {
      userData.lastName = lastName;
    }

    if (phoneNumber) {
      userData.phoneNumber = phoneNumber;
      userData.phoneVerified = false;
    }

    if (recoveryPhoneNumber) {
      userData.recoveryPhoneNumber = recoveryPhoneNumber;
    }

    await User.findByIdAndUpdate(id, {
      $set: { ...userData },
      $inc: { version: 1 },
    });

    return res.status(200).send({ message: "User updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error!" });
  }
};
