import { User } from "../models/user";
export async function newUser(user: { password: string; username: string }) {
  try {
    const newUser = new User(user);

    await newUser.save();

    const result = await User.find({});

    console.log("USER CREATED ON THE QUERY SERVICE", result);
  } catch (error) {
    console.log(error);
  }
}
