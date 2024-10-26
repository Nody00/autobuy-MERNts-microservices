import express from "express";
import { deleteListingController } from "../controllers/delete-listing";
const router = express.Router();

router.delete("/delete-listing/:listingId", deleteListingController);

export { router as deleteListingRouter };
