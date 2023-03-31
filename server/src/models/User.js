import mongoose from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const { SchemaTypes } = mongoose;
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    comments: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
    favoriteMuseums: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Museum",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export const validateUser = (userObject) => {
  const errorList = [];
  const allowedKeys = ["firstName", "lastName", "email", "password"];

  const validatedKeysMessage = validateAllowedFields(userObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (userObject.firstName == null) {
    errorList.push("firstName is a required field");
  }

  if (userObject.lastName == null) {
    errorList.push("lastName is a required field");
  }

  if (userObject.email == null) {
    errorList.push("email is a required field");
  }

  if (!userObject.password) {
    errorList.push("password is a required field");
  }

  return errorList;
};

export default User;
