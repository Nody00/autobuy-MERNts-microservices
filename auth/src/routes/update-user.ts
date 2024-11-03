import express from "express";
import { body, param } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import mongoose from "mongoose";
import { updateUserController } from "../controllers/update-user";
import { permissionMiddleware } from "../middleware/permissionMiddleware";
const router = express.Router();

router.patch(
  "/users/:id",
  authMiddleware,
  permissionMiddleware("update", "users"),
  [
    param("id").custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Id!");
      }

      return true;
    }),
    body("email")
      .optional()
      .isString()
      .trim()
      .isEmail()
      .withMessage("Must be a valid email!"),
    body("firstName")
      .optional()
      .isString()
      .isLength({ max: 20 })
      .withMessage("First name cannot be longer than 20 characters"),
    body("lastName")
      .optional()
      .isString()
      .isLength({ max: 20 })
      .withMessage("Last name cannot be longer than 20 characters"),
    body("phoneNumber")
      .optional()
      .isString()
      .trim()
      .isMobilePhone("any")
      .withMessage("You must provide a valid phone number"),
    body("recoveryPhoneNumber")
      .optional()
      .isString()
      .trim()
      .isMobilePhone("any")
      .withMessage("You must provide a valid phone number"),
  ],
  // @ts-ignore
  updateUserController
);

export { router as updateUserRouter };
