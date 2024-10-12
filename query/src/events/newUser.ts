import { User } from "../models/user";
export async function newUser(user: { password: string; username: string }) {
  try {
    const newUser = new User(user);

    const savedUser = await newUser.save();

    console.log("USER CREATED ON THE QUERY SERVICE", savedUser);
  } catch (error) {
    console.log(error);
  }
}
