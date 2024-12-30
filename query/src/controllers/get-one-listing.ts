import { Request, Response } from "express";
import { Listing } from "../models/listing";
import { validationResult } from "express-validator";

interface RequestParams {
  id: string;
}

export const getOneListingController = async (
  req: Request<RequestParams, {}, {}>,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const listing = await Listing.findOne({
      _id: id,
      deleted: { $ne: true },
    }).populate({
      path: "userId",
      select: "name email phone",
    });

    if (!listing) {
      return res.status(404).send({ message: "No such listing found!" });
    }

    await Listing.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    const responseData = {
      ...listing.toJSON(),
      isNegotiable: listing.negotiable,
      viewCount: listing.views + 1, // Include the just-incremented view
      savesCount: listing.savedBy?.length || 0,
      // Add any computed fields here
      ageInYears: new Date().getFullYear() - listing.yearOfProduction,
      registrationAge:
        new Date().getFullYear() - listing.firstYearOfRegistration,
    };

    // Send successful response
    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getOneListingController:", error);
    return res.status(500).send({ message: "Server error" });
  }
};
