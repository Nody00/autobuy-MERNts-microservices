import express from "express";
import { query } from "express-validator";
import { getListingController } from "../controllers/get-listing";
import { CATEGORIES } from "../helpers/categories";
const router = express.Router();

interface ListingQuery {
  manufacturer?: string;
  model?: string;
  yearFrom?: string;
  yearTo?: string;
  priceMin?: string;
  priceMax?: string;
  mileageMax?: string;
  category?: string;
  status?: string;
  isFeatured?: string;
  negotiable?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

router.get(
  "/get",
  [
    query("manufacturer")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Manufacturer must be between 1 and 100 characters"),

    query("model")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Manufacturer must be between 1 and 100 characters"),

    query("yearFrom")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year from must be between 1900 and the current year"),

    query("yearTo")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year from must be between 1900 and the current year")
      .custom((yearTo, { req }) => {
        if (!req.query) {
          throw new Error("Invalid query");
        }
        const yearFrom = req.query.yearFrom;

        if (yearFrom && parseInt(yearTo) < parseInt(yearFrom)) {
          throw new Error("Year to must be greater than or equal to year from");
        }
        return true;
      }),

    query("priceMin")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Minimum price must be a positive number"),

    query("priceMax")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Maximum price must be a positive number")
      .custom((priceMax, { req }) => {
        if (!req.query) {
          throw new Error("Invalid query");
        }
        const priceMin = req.query.priceMin;
        if (priceMin && parseFloat(priceMax) < parseFloat(priceMin)) {
          throw new Error(
            "Maximum price must be greater than or euqal to the minimum price"
          );
        }
        return true;
      }),

    query("mileageMin")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Minimum mileage must be a positive value"),

    query("mileageMax")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Maximum mileage must be a positive value")
      .custom((mileageMax, { req }) => {
        if (!req.query) {
          throw new Error("Invalid query");
        }
        const mileageMin = req.query.mileageMin;
        if (mileageMin && parseFloat(mileageMax) < parseFloat(mileageMin)) {
          throw new Error(
            "Maximum mileage must be greater than or equal to the minimum price"
          );
        }

        return true;
      }),

    query("category")
      .optional()
      .isInt()
      .custom((value) => {
        if (!Object.values(CATEGORIES).includes(parseInt(value))) {
          throw new Error("Invalid category");
        }

        return true;
      }),

    query("status")
      .optional()
      .isIn(["available", "sold"])
      .withMessage("Status must be either available or sold"),

    query("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured must be a boolean"),

    query("negotiable")
      .optional()
      .isBoolean()
      .withMessage("negotiable must be a boolean"),

    query("tags")
      .optional()
      .isString()
      .custom((value: string) => {
        const tags = value.split(",").map((tag) => tag.trim());
        if (tags.some((tag) => tag.length < 1 || tag.length > 50)) {
          throw new Error("Each tag must be between 1 and 50 characters");
        }
        return true;
      }),

    query("sortBy")
      .optional()
      .isIn(["price", "yearOfProduction", "mileage", "createdAt", "views"])
      .withMessage("Invalid sort field"),

    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),

    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  ],

  getListingController
);

export { router as getListingRouter };
