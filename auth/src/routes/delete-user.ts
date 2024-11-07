import express from "express";
import { param } from "express-validator";
import mongoose from "mongoose";
import { deleteUserController } from "../controllers/delete-user";
import { authMiddleware } from "../middleware/auth";
import { permissionMiddleware } from "../middleware/permissionMiddleware";
const router = express.Router();

router.delete(
  "/users/:id",
  authMiddleware,
  permissionMiddleware("delete", "users"),
  [
    param("id").custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Id");
      }

      return true;
    }),
  ],
  // @ts-ignore
  deleteUserController
);

export { router as deleteUserRouter };
