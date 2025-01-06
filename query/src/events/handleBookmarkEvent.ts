interface message {
  listingId: string;
  userId: string;
  operation: "add" | "remove";
}
import mongoose, { mongo } from "mongoose";
import { User } from "../models/user";
import { Listing } from "../models/listing";

export const handleBookMarkEvent = async ({
  listingId,
  userId,
  operation,
}: message) => {
  if (operation === "add") {
    // add the listing id to the users saves array
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("No user found!");
    }

    let userBookmarkExists = false;
    user.saves.forEach((el) => {
      if (el.toString() === listingId) {
        userBookmarkExists = true;
      }
    });

    if (!userBookmarkExists) {
      const newSaves = [...user.saves, new mongoose.Types.ObjectId(listingId)];

      await User.updateOne(
        { _id: user._id },
        {
          $set: { saves: newSaves },
          $inc: { version: 1 },
        }
      );
    }

    // add the userId to the listing save array

    const listing = await Listing.findById(listingId);

    if (!listing) {
      throw new Error("No listing found");
    }
    console.log("dinov log listing", listing);
    let listingUserIdSaveExists = false;
    listing.savedBy.forEach((el) => {
      if (el.toString() === userId) {
        listingUserIdSaveExists = true;
      }
    });

    if (!listingUserIdSaveExists) {
      const newSaves = [
        ...listing.savedBy,
        new mongoose.Types.ObjectId(userId),
      ];

      await Listing.updateOne(
        { _id: listing._id },
        {
          $set: { savedBy: newSaves },
          $inc: { version: 1 },
        }
      );
    }

    console.log("User listing bookmark added");
    return;
  }

  if (operation === "remove") {
    // add the listing id to the users saves array
    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId);

    if (!user) {
      throw new Error("No user found!");
    }

    if (!listing) {
      throw new Error("No listing found");
    }

    const newSaves = user.saves.filter((el) => el.toString() !== listingId);
    const newListingSaves = listing.savedBy.filter(
      (el) => el?._id?.toString() !== userId
    );

    await User.updateOne(
      { _id: user._id },
      {
        $set: { saves: newSaves },
        $inc: { version: 1 },
      }
    );

    await Listing.updateOne(
      { _id: listingId },
      {
        $set: { savedBy: newListingSaves },
        $inc: { version: 1 },
      }
    );
    console.log("User listing bookmark removed");
    return;
  }
};
