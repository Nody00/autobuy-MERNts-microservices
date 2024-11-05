import express, { Request, Response } from "express";
import { param } from "express-validator";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth";
import { permissionMiddleware } from "../middleware/permissionMiddleware";
import { saveListingController } from "../controllers/save-listing";
const router = express.Router();

router.post(
  "/save/:listingId",
  authMiddleware,
  // @ts-ignore
  permissionMiddleware("update", "listings"),
  [
    param("listingId").custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Id!");
      }
      return true;
    }),
  ],
  // @ts-ignore
  saveListingController
);

export { router as saveListingRouter };
