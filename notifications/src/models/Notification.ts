import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  sellerId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  type: "BID_END" | "NEW_BID" | "OUTBID" | "AUCTION_WON";
  title: string;
  message: string;
  status: "UNREAD" | "READ";
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    type: {
      type: String,
      enum: ["BID_END", "NEW_BID", "OUTBID", "AUCTION_WON"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["UNREAD", "READ"],
      default: "UNREAD",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
