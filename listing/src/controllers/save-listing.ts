import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Listing } from "../models/listing";
import mongoose from "mongoose";
import { rabbit } from "../service/RabbitMQService";
interface saveListingRequest extends Request {
  user: {
    id: string;
  };
}

export const saveListingController = async (
  req: saveListingRequest,
  res: Response
) => {
  // handle errors if any
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // get user data from request, get listing id from params
  const { id } = req.user || {};

  if (!id) {
    return res.status(400).send({ message: "User information not provided!" });
  }

  const { listingId } = req.params;

  const userObjectId = new mongoose.Types.ObjectId(id);
  const foundListing = await Listing.findById(listingId);

  if (!foundListing) {
    return res.status(404).send({ message: "Listing not found!" });
  }

  let isListingAlreadySaved = false;

  foundListing.savedBy.forEach((el) => {
    if (el.toString() === id.toString()) {
      isListingAlreadySaved = true;
    }
  });
  console.log("Operation:", isListingAlreadySaved ? "remove" : "add");
  // if user already saved the listing remove it from the array
  try {
    if (isListingAlreadySaved) {
      const newListing = {
        savedBy: foundListing.savedBy.filter(
          (el) => el.toString() !== id.toString()
        ),
      };

      await Listing.updateOne(
        { _id: listingId },
        {
          $set: { savedBy: newListing.savedBy },
          $inc: { version: 1 },
        }
      );

      rabbit.sendMessage("listing-events", "bookmark.listings.remove", {
        listingId,
        userId: id,
        operation: "remove",
      });
      return res.status(200).send({ message: "Listing save removed!" });
    }

    // save the userId into the listing array if it is not there
    if (!isListingAlreadySaved) {
      const newListing = {
        savedBy: [...foundListing.savedBy],
      };

      // @ts-ignore
      newListing.savedBy.push(userObjectId);

      await Listing.updateOne(
        { _id: listingId },
        {
          $set: { savedBy: newListing.savedBy },
          $inc: { version: 1 },
        }
      );

      rabbit.sendMessage("listing-events", "bookmark.listings.add", {
        listingId,
        userId: id,
        operation: "add",
      });
      return res.status(200).send({ message: "Listing saved!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error!" });
  }
};
