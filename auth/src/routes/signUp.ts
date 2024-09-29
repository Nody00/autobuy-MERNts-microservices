import axios from "axios";
import express from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

interface SignUpRequestBody {
  username: string;
  password: string;
}

const router = express.Router();

router.post(
  "/users/sign-up",
  [
    body("username")
      .exists()
      .isString()
      .isLength({ max: 20, min: 3 })
      .withMessage("Username must be between 3 and 20 characters"),
    body("password")
      .exists()
      .isString()
      .isLength({ max: 30, min: 8 })
      .withMessage("Password must be between 8 and 30 characters"),
  ],
  async (req: Request<{}, {}, SignUpRequestBody>, res: Response) => {
    // handle the errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // logic for creating user

    const newUser = {
      username: req.body.username,
      password: req.body.password,
    };

    console.log("dinov log newUser", newUser);

    const result = await axios.post(
      "http://event-bus-srv:5000/event-bus/new/event",
      {
        type: "newUser",
        data: newUser,
      }
    );

    console.log("dinov log result", result.data);

    res.status(200).json(result.data);
  }
);

export { router as signUpRoute };
