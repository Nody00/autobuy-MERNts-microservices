import express from "express";
import { param } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { permissionMiddleware } from "../middleware/permissionMiddleware";
import mongoose from "mongoose";
import { getOneUserController } from "../controllers/get-one-user";
const router = express.Router();

router.get("/user/:id", authMiddleware, permissionMiddleware("read", "users"), [
  param("id")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return false;
      }
      return true;
    })
    .withMessage("Must be a valid id!"),
  // @ts-ignore
  getOneUserController,
]);

export { router as getOneUserRouter };
