import { Request, Response } from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { Listing } from "../models/Listing";
import { Bid } from "../models/Bid";
import { rabbit } from "../service/RabbitMQService";

interface RequestBody {
  userId: string;
  listingId: string;
  amount: number;
}

export const createBidController = async (
  req: Request<{}, {}, RequestBody>,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { listingId, amount } = req.body;
  // @ts-ignore
  const { id: userId } = req.user || {};

  if (!userId) {
    return res.status(400).send({ message: "User information not provided!" });
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    return res.status(404).send({ message: "Listing not found!" });
  }

  if (new Date(listing.endBiddingAt).getTime() < new Date().getTime()) {
    return res.status(400).send({ message: "Bidding time has ended!" });
  }

  if (listing.highestBid) {
    const highestBid = await Bid.findById(listing.highestBid);
    if (highestBid && amount <= highestBid.amount) {
      return res.status(400).send({ message: "Invalid bid amount" });
    }
  }

  // create bid
  const newBid = new Bid({
    userId: new mongoose.Types.ObjectId(userId),
    listingId: new mongoose.Types.ObjectId(listingId),
    amount: amount,
  });
  await newBid.save();

  console.log("New bid created", newBid);

  // update listing
  const updatedListing = await Listing.findByIdAndUpdate(
    listing._id,
    {
      $set: {
        highestBid: newBid._id,
      },
      $inc: { version: 1 },
    },
    {
      lean: true,
    }
  );

  // send rabbitmq messages for both event
  await rabbit.sendMessage("bids-events", "bids.new", {
    operation: "create",
    ...newBid,
  });

  await rabbit.sendMessage("listing-events", "listings.update", {
    operation: "update",
    ...updatedListing,
  });

  res.status(200).send({ message: "Bid added!" });
};
