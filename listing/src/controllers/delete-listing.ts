import { Request, Response } from "express";

import { Listing } from "../models/listing";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { rabbit } from "../service/RabbitMQService";
interface RequestParams {
  listingId: string;
  user: string | JwtPayload;
}

export const deleteListingController = async (
  req: Request<RequestParams>,
  res: Response
) => {
  const { listingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return res.status(400).send({ message: "Invalid id!" });
  }

  try {
    const foundListing = await Listing.findOne({ _id: listingId });

    if (!foundListing) {
      return res.status(404).send({ message: "No such listing found!" });
    }

    await Listing.updateOne(
      { _id: foundListing._id },
      { $set: { deleted: true }, $inc: { version: 1 } }
    );

    const result = await Listing.findById(foundListing._id);
    rabbit.sendMessage("listing-events", "listings.delete", {
      ...result?.toObject(),
      operation: "update",
    });
    return res.status(200).send({ message: "Listing deleted!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error!" });
  }
};
