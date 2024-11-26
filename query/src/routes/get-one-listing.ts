import express from "express";
import { param } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { permissionMiddleware } from "../middleware/permissionMiddleware";
import { getOneListingController } from "../controllers/get-one-listing";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/listing/:id",
  authMiddleware,
  permissionMiddleware("read", "listings"),
  [
    param("id")
      .custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return false;
        }
        return true;
      })
      .withMessage("Must be a valid id!"),
  ],
  // @ts-ignore
  getOneListingController
);

export { router as getOneListingRouter };
