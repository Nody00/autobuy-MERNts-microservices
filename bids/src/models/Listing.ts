import mongoose, { Schema, Types } from "mongoose";
import { CATEGORIES } from "../helpers/categories";

const listingSchema = new Schema({
  manufacturer: {
    required: true,
    type: String, // Brand or manufacturer of the vehicle (e.g., Toyota, Ford)
  },
  model: {
    required: true,
    type: String, // Specific model (e.g., Camry, F-150)
  },
  yearOfProduction: {
    required: true,
    type: Number, // The year the vehicle was produced
  },
  mileage: {
    required: true,
    type: Number, // Mileage of the vehicle (in kilometers or miles)
  },
  firstYearOfRegistration: {
    required: true,
    type: Number, // The first year the vehicle was registered
  },
  description: {
    type: String, // Additional details about the vehicle
  },
  price: {
    required: true,
    type: Number, // Price of the vehicle
  },
  category: {
    required: true,
    type: Number,
    enum: Object.values(CATEGORIES), // Vehicle category (e.g., cars, trucks)
  },
  status: {
    type: String, // e.g., "available", "sold"
  },
  views: {
    type: Number, // Number of views on the listing
  },
  savedBy: {
    type: [Types.ObjectId], // Users who saved/bookmarked the listing
  },
  isFeatured: {
    type: Boolean, // Whether the listing is featured
  },
  negotiable: {
    type: Boolean, // If the price is negotiable
  },
  tags: {
    type: [String], // Searchable tags
  },
  userId: {
    type: Types.ObjectId,
    required: true, // Reference to the user who created the listing
    ref: "User",
  },
  deleted: {
    type: Boolean,
  },
  version: {
    type: Number,
    default: 1,
    required: true,
  },
  endBiddingAt: {
    type: Date,
    required: true,
  },
  highestBid: {
    type: Types.ObjectId,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
  ],
});

const Listing = mongoose.model("Listing", listingSchema);

export { Listing };
