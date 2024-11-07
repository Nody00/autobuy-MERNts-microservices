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

  // @ts-ignore
  const { id } = req.user || {};

  if (!id) {
    return res.status(400).send({ message: "User information not provided!" });
  }

  const newListing = {
    ...req.body,
    deleted: false,
    status: "available",
    views: 0,
    userId: id.toString(),
  };
  try {
    const result = new Listing(newListing);
    await result.save();

    rabbit.sendMessage("listing-events", "listings.new", {
      ...result.toObject(),
      operation: "create",
    });
    return res.status(201).send({ message: "Listing created", data: result });
  } catch (error) {
    console.error("DB error on listing creation");
    return res.status(500).send({ message: "Could not create listing!" });
  }
};
