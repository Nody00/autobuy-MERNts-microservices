import { AsyncMessage } from "rabbitmq-client";
import { newListingEvent } from "../event_types/newListingEvent";
import { Listing } from "../models/listing";
export const handleListingEvent = async (msg: AsyncMessage) => {
  const event = msg.body as newListingEvent;
  const existingListing = await Listing.findById(event._id);

  if (event.operation === "create") {
    // Check if listing already exists
    if (existingListing) {
      console.error(`Listing ${event._id} already exists!`);
      throw new Error(`Listing ${event._id} already exists!`);
    }

    // Save new listing
    const newListing = new Listing({ ...event });

    await newListing.save();
    console.log("Listing creation successful!");
    return;
  }

  if (event.operation === "update") {
    if (!existingListing) {
      throw new Error(`Listing ${event._id} not found for update`);
    }

    // Version check
    if (event.version !== existingListing.version + 1) {
      if (event.version <= existingListing.version) {
        // Old or duplicate event, acknowladge and ignore
        console.error(
          `Received old version ${event.version} for listing ${event._id}. Current version: ${existingListing.version}`
        );
        return;
      } else {
        throw new Error(`Version gap detected for listing ${event._id}`);
      }
    }

    // Apply update
    await Listing.findByIdAndUpdate(event._id, {
      $set: {
        ...event,
      },
    });
    console.log("Listing update successful!");
    return;
  }
};
