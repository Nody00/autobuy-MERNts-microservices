import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema({
  email: {
    required: true,
    type: String,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  phoneNumber: {
    required: true,
    type: String,
  },
  recoveryPhoneNumber: {
    type: String,
  },
  recoveryEmail: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
  },
  phoneVerified: {
    type: Boolean,
  },
  saves: {
    type: [Types.ObjectId], // ids of listings the user saved(bookmarked)
  },
  deleted: {
    type: Boolean,
  },
  version: {
    type: Number,
  },
  isAdmin: {
    type: Boolean,
  },
  isCustomer: {
    type: Boolean,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    // required: true,
  },
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1 }, { unique: true });

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export { User };
