import { AsyncMessage } from "rabbitmq-client";
import { newListingEvent } from "../event_types/newListingEvent";
import { Listing } from "../models/Listing";
export const handleListingEvent = async (msg: AsyncMessage) => {
  const event = msg.body as newListingEvent;
  const existingListing = await Listing.findById(event._id);

  if (event.operation === "create") {
    console.log("CREATE event on the BIDDING service", event);
    // Check if listing already exists
    if (existingListing) {
      console.warn(`Listing ${event._id} already exists!`);
      throw new Error(`Listing ${event._id} already exists!`);
    }

    // Save new listing
    const newListing = new Listing({ ...event });

    await newListing.save();
    console.log("Listing creation successful!");
    return;
  }
};
