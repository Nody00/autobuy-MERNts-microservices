import { Request, Response } from "express";
import { Listing } from "../models/listing";
import { validationResult } from "express-validator";
interface ListingQuery {
  manufacturer?: string;
  model?: string;
  yearFrom?: string;
  yearTo?: string;
  priceMin?: string;
  priceMax?: string;
  mileageMax?: string;
  mileageMin?: string;
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

export const getListingController = async (
  req: Request<{}, {}, {}, ListingQuery>,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      manufacturer,
      model,
      yearFrom,
      yearTo,
      priceMin,
      priceMax,
      mileageMax,
      mileageMin,
      category,
      status,
      isFeatured,
      negotiable,
      tags,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // Build match stage for filtering
    const matchStage: Record<string, any> = {
      deleted: { $ne: true },
    };

    if (manufacturer) {
      matchStage.manufacturer = { $regex: new RegExp(manufacturer, "i") };
    }

    if (model) {
      matchStage.model = { $regex: new RegExp(model, "i") };
    }

    if (yearFrom || yearTo) {
      matchStage.yearOfProduction = {};
      if (yearFrom) matchStage.yearOfProduction.$gte = parseInt(yearFrom);
      if (yearTo) matchStage.yearOfProduction.$lte = parseInt(yearTo);
    }

    if (priceMin || priceMax) {
      matchStage.price = {};
      if (priceMin) matchStage.price.$gte = parseFloat(priceMin);
      if (priceMax) matchStage.price.$lte = parseFloat(priceMax);
    }

    if (mileageMin || mileageMax) {
      matchStage.mileage = {};
      if (mileageMin) matchStage.price.$gte = parseFloat(mileageMin);
      if (mileageMax) matchStage.price.$lte = parseFloat(mileageMax);
    }

    if (category) {
      matchStage.category = parseInt(category);
    }

    if (status) {
      matchStage.status = status;
    }

    if (isFeatured !== undefined) {
      matchStage.isFeatured = isFeatured === "true";
    }

    if (negotiable !== undefined) {
      matchStage.negotiable = negotiable === "true";
    }

    if (tags) {
      matchStage.tags = { $in: tags.split(",").map((tag) => tag.trim()) };
    }

    // Calculate the pagination values
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortStage: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "desc" ? -1 : 1,
    };

    // Build aggregation pipeline
    const pipeline = [
      // Initial match stage for filtering
      { $match: matchStage },

      // Lookup user details
      //    {
      //     $lookup: {
      //       from: "users",
      //       localField: "userId",
      //       foreignField: "_id",
      //       as: "userDetails"
      //     }
      //   },

      // Unwind the user details array
      //   {
      //     $unwind: {
      //       path: "$userDetails",
      //       preserveNullAndEmptyArrays: true
      //     }
      //   },

      {
        $project: {
          _id: 1,
          manufacturer: 1,
          model: 1,
          yearOfProduction: 1,
          mileage: 1,
          firstYearOfRegistration: 1,
          description: 1,
          price: 1,
          category: 1,
          status: 1,
          views: 1,
          saves: 1,
          isFeatured: 1,
          negotiable: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1,
          version: 1,
          //   user: {
          //     _id: "$userDetails._id",
          //     name: "$userDetails.name",
          //     email: "$userDetails.email",
          //   },
        },
      },

      // Sort stage
      { $sort: sortStage },

      // Facet stage for pagination
      {
        $facet: {
          metadata: [{ $count: "total" }],
          listings: [{ $skip: skip }, { $limit: limitNum }],
        },
      },
    ];

    const [result] = await Listing.aggregate(pipeline);

    // Extract metadata and listings
    const total = result.metadata[0]?.total ?? 0;
    const listings = result.listings;

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        listings,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Error in getListingController:", error);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching listings",
    });
  }
};
