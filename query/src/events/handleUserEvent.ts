import { User } from "../models/user";

interface message {
  operation: "create" | "delete" | "update";
  data: {};
}

export async function handleUserEvent(message: message) {
  try {
    if (message.operation === "create") {
      const newUser = new User(message.data);

      const savedUser = await newUser.save();

      console.log("USER CREATED ON THE QUERY SERVICE", savedUser);
    }
  } catch (error) {
    console.log(error);
  }
}
