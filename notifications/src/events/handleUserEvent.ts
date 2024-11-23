import { AsyncMessage } from "rabbitmq-client";
import { newUserEvent } from "../event_types/newUserEvent";
import { User } from "../models/User";

export async function handleUserEvent(message: AsyncMessage) {
  const event = message.body as newUserEvent;
  const existingUser = await User.findById(event._id);

  try {
    if (event.operation === "create") {
      if (existingUser) {
        console.error(`User ${event._id} already exists!`);
        throw new Error(`User ${event._id} already exists!`);
      }

      // Save the new user
      const newUser = new User({ ...event });

      await newUser.save();
      console.log("New user saved!");
      return;
    }

    if (event.operation === "update") {
      if (!existingUser) {
        throw new Error(`User ${event._id} not found for update`);
      }

      // Version check
      if (event.version !== existingUser.version + 1) {
        if (event.version <= existingUser.version) {
          // Old or duplicate event, acknowladge and ignore
          console.error(
            `Received old version ${event.version} for user ${event._id}. Current version: ${existingUser.version}`
          );
          return;
        } else {
          throw new Error(`Version gap detected for user ${event._id}`);
        }
      }

      // Apply update
      await User.findByIdAndUpdate(event._id, {
        $set: {
          ...event,
        },
      });
      console.log("User updated");
    }
  } catch (error) {
    console.log(error);
  }
}
