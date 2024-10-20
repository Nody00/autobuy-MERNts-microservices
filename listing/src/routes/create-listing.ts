import express from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
const router = express.Router();

router.post("/new-listing", [
  body("userId")
    .isString()
    .withMessage("userId must be a string.")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid userId, must be a valid MongoDB ObjectId.");
      }
      return true;
    })
    .withMessage("userId must be a valid MongoDB ObjectId."),

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
    .isInt({ min: 1 })
    .withMessage("Category must be a valid integer."),
]);

export default router;
