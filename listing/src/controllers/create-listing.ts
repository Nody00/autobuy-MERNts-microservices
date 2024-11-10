import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Listing } from "../models/listing";
import { rabbit } from "../service/RabbitMQService";
import { cloudinary } from "../config/cloudinary";

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
  images?: ImageUpload[];
}

interface ImageUpload {
  url: string;
  publicId: string;
}

export const createListingController = async (
  req: Request<{}, {}, RequestBody>,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // if there were any errors we need to clean up the possibly uploaded images
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        if (file.path) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }
    }
    return res.status(400).json({ errors: errors.array() });
  }

  // @ts-ignore
  const { id } = req.user || {};

  if (!id) {
    return res.status(400).send({ message: "User information not provided!" });
  }

  const imageUploads = (req.files as Express.Multer.File[]).map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  const newListing = {
    ...req.body,
    deleted: false,
    status: "available",
    views: 0,
    userId: id.toString(),
    images: imageUploads,
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
    // if there is an error clean up the files
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        if (file.path) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }
    }

    console.error("Error creating listing:", error);
    return res.status(500).send({ message: "Could not create listing!" });
  }
};
