interface message {
  listingId: string;
  userId: string;
  operation: "add" | "remove";
}
import mongoose from "mongoose";
import { User } from "../models/user";

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

    user.saves.forEach((el) => {
      if (el.toString() === listingId) {
        throw new Error("Listing already saved");
      }
    });

    const newSaves = [...user.saves, new mongoose.Types.ObjectId(listingId)];

    await User.updateOne(
      { _id: user._id },
      {
        $set: { saves: newSaves },
        $inc: { version: 1 },
      }
    );
    console.log("User listing bookmark added");
    return;
  }

  if (operation === "remove") {
    // add the listing id to the users saves array
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("No user found!");
    }

    const newSaves = user.saves.filter((el) => el.toString() !== listingId);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { saves: newSaves },
        $inc: { version: 1 },
      }
    );
    console.log("User listing bookmark removed");
    return;
  }
};
