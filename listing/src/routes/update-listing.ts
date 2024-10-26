import express from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { CATEGORIES } from "../helpers/categories";
const router = express.Router();
import { updateListingController } from "../controllers/update-listing";

router.patch(
  "/update-listing/:listingId",
  [
    body("manufacturer")
      .optional()
      .isString()
      .withMessage("Manufacturer must be a string.")
      .trim()
      .isLength({ max: 20 })
      .withMessage("Manufacturer name cannot exceed 20 characters."),

    body("model")
      .optional()
      .isString()
      .withMessage("Model must be a string.")
      .trim()
      .isLength({ max: 20 })
      .withMessage("Model name cannot exceed 20 characters."),

    body("yearOfProduction")
      .optional()
      .isNumeric()
      .withMessage("Year of production must be a number."),

    body("mileage")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive integer."),

    body("firstYearOfRegistration")
      .optional()
      .isInt({
        min: 1900,
        max: new Date().getFullYear(),
      })
      .withMessage(
        `First year of registration must be between 1900 and ${new Date().getFullYear()}.`
      ),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string.")
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters."),

    body("price")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Price must be a positive integer."),

    body("category")
      .optional()
      .custom((value) => {
        if (!Object.values(CATEGORIES).includes(value)) {
          return false;
        }

        return true;
      })
      .withMessage("You must select a valid category."),
  ],
  updateListingController
);

export { router as updateListingRouter };
