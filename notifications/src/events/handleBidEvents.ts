import { AsyncMessage } from "rabbitmq-client";

import { Bid } from "../models/Bid";
import { newBidEvent } from "../event_types/newBidEvent";
export const handleBidEvent = async (msg: AsyncMessage) => {
  const event = msg.body as newBidEvent;
  const existingBid = await Bid.findById(event._id);

  if (event.operation === "create") {
    console.log("CREATE event on the QUERY service", event);
    // Check if Bid already exists
    if (existingBid) {
      console.warn(`Bid ${event._id} already exists!`);
      throw new Error(`Bid ${event._id} already exists!`);
    }

    // Save new bid

    const newBid = new Bid({ ...event });

    await newBid.save();
    console.log("Bid creation successful!");
    return;
  }
};
