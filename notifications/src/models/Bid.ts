import mongoose, { Schema, Types } from "mongoose";

const bidSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bid = mongoose.model("Bid", bidSchema);

export { Bid };
