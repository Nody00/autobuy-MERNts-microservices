import express from "express";
import { body } from "express-validator";
import { signInController } from "../controllers/sign-in";

const router = express.Router();

router.post(
  "/users/sign-in",
  [
    body("email")
      .exists()
      .trim()
      .isEmail()
      .withMessage("You must enter a valid email!"),
    body("password")
      .exists()
      .trim()
      .isLength({ max: 30, min: 8 })
      .withMessage("You must enter a valid password!"),
  ],
  signInController
);

export { router as signInRoute };
