import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { Listing } from "../models/listing";

interface RequestParams {
  listingId: string;
}

interface RequestBody {
  manufacturer: string;
  model: string;
  yearOfProduction: number;
  mileage: number;
  firstYearOfRegistration: number;
  description: string | null;
  price: number;
  category: number;
  userId: string;
}
export const updateListingController = async (
  req: Request<RequestParams, {}, RequestBody>,
  res: Response
) => {
  const { listingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return res.status(400).send({ message: "Invalid id!" });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newData = req.body;

  try {
    const foundListing = await Listing.findOne({
      _id: listingId,
      deleted: false,
    });

    if (!foundListing) {
      return res.status(404).send({ message: "Listing not found!" });
    }

    await Listing.updateOne(
      { _id: listingId },
      {
        $set: newData,
      }
    );

    return res.status(204).send({ message: "Listing updated!" });
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: "Internal server error!" });
  }
};
