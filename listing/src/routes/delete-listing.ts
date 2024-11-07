import express from "express";
import { deleteListingController } from "../controllers/delete-listing";
import { authMiddleware } from "../middleware/auth";
import { permissionMiddleware } from "../middleware/permissionMiddleware";
const router = express.Router();

router.delete(
  "/delete-listing/:listingId",
  authMiddleware,
  permissionMiddleware("delete", "listings"),
  // @ts-ignore
  // I need to figure out how to define the ts types for the params correctly and not brake everything
  // thats a job for future Dino
  // @ts-ignore
  deleteListingController
);

export { router as deleteListingRouter };
