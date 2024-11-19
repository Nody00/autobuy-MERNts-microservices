import { User } from "../models/User";

interface message {
  operation: "create" | "delete" | "update";
  data: {};
}

export async function handleUserEvent(message: message) {
  try {
    if (message.operation === "create") {
      const newUser = new User(message.data);

      const savedUser = await newUser.save();

      console.log("user created on the notification service", savedUser);
    }
  } catch (error) {
    console.log(error);
  }
}
