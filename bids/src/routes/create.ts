import { Router } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
const router = Router();
import { createBidController } from "../controllers/create";
import { authMiddleware } from "../middleware/auth";
import { permissionMiddleware } from "../middleware/permissionMiddleware";

router.post("/new", authMiddleware, permissionMiddleware("create", "bids"), [
  body("listingId")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return false;
      }
      return true;
    })
    .withMessage("Must provide a valid listingId"),
  body("amount").isInt().withMessage("Amount must be a valid number"),
  createBidController,
]);

export { router as createBidRouter };
