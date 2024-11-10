import express from "express";
import { body } from "express-validator";
import { uploadMiddleware } from "../middleware/imageUpload";
import { CATEGORIES } from "../helpers/categories";
import { createListingController } from "../controllers/create-listing";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post(
  "/new-listing",
  authMiddleware,
  uploadMiddleware,
  [
    body("images").custom((value, { req }) => {
      if (!req.files || req.files.length === 0) {
        throw new Error("At least one image is required!");
      }
      if (req.files.length > 5) {
        throw new Error("Maximum 5 images allowed");
      }
      return true;
    }),

    body("manufacturer")
      .isString()
      .withMessage("Manufacturer must be a string.")
      .trim()
      .isLength({ max: 20 })
      .withMessage("Manufacturer name cannot exceed 20 characters."),

    body("model")
      .isString()
      .withMessage("Model must be a string.")
      .trim()
      .isLength({ max: 20 })
      .withMessage("Model name cannot exceed 20 characters."),

    body("yearOfProduction")
      .isNumeric()
      .withMessage("Year of production must be a number."),

    body("mileage")
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive integer."),

    body("firstYearOfRegistration")
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
      .isInt({ min: 1 })
      .withMessage("Price must be a positive integer."),

    body("category")
      .custom((value) => {
        if (!Object.values(CATEGORIES).includes(Number(value))) {
          return false;
        }

        return true;
      })
      .withMessage("You must select a valid category."),
  ],
  createListingController
);

export { router as createListingRouter };
