import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export { User };
