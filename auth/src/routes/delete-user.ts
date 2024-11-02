import express from "express";
import { param } from "express-validator";
import mongoose from "mongoose";
import { deleteUserController } from "../controllers/delete-user";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();

router.delete(
  "/users/:id",
  [
    param("id").custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Id");
      }

      return true;
    }),
  ],
  authMiddleware,
  // @ts-ignore
  deleteUserController
);

export { router as deleteUserRouter };
