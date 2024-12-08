import express from "express";

import { body } from "express-validator";
import { signUpController } from "../controllers/sign-up";
const router = express.Router();

router.post(
  "/users/sign-up",
  [
    body("email")
      .exists()
      .isString()
      .trim()
      .isEmail()
      .withMessage("Must be a valid email!"),
    body("password")
      .exists()
      .isString()
      .trim()
      .isLength({ max: 30, min: 8 })
      .withMessage("Password must be between 8 and 30 characters"),
    body("firstName")
      .exists()
      .isString()
      .isLength({ max: 20 })
      .withMessage("First name cannot be longer than 20 characters"),
    body("lastName")
      .exists()
      .isString()
      .isLength({ max: 20 })
      .withMessage("Last name cannot be longer than 20 characters"),
    body("phoneNumber")
      .exists()
      .isString()
      .trim()
      .withMessage("You must provide a valid phone number"),
    body("isAdmin")
      .exists()
      .isBoolean()
      .withMessage("You must specify the kind of user!"),
  ],
  signUpController
);

export { router as signUpRoute };
