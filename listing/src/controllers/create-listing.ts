import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Listing } from "../models/listing";
import { rabbit } from "../service/RabbitMQService";

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

export const createListingController = async (
  req: Request<{}, {}, RequestBody>,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // console.log("THE REQUEST", req.headers.cookie);
  // WRITE MIDDLEWARE TO CHECK IF LOGGED IN
  const newListing = { ...req.body };
  try {
    const result = new Listing(newListing);
    await result.save();
  } catch (error) {
    console.error("DB error on listing creation");
    return res.status(500).send({ message: "Could not create listing!" });
  }

  rabbit.sendMessage("listing-events", "listings.new", newListing);
  return res.status(201).send({ message: "Listing created" });
};
