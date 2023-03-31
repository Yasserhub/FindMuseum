import mongoose from "mongoose";

import validateAllowedFields from "../util/validateAllowedFields.js";

const { SchemaTypes } = mongoose;
const commentSchema = new mongoose.Schema(
  {
    userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    museumId: { type: SchemaTypes.ObjectId, ref: "Museum", required: true },
    rate: { type: String, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export const validateComment = (commentObject) => {
  const errorList = [];
  const allowedKeys = ["userId", "museumId", "rate", "review"];

  const validatedKeysMessage = validateAllowedFields(
    commentObject,
    allowedKeys
  );

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (commentObject.userId == null) {
    errorList.push("userId is a required field");
  }

  if (commentObject.museumId == null) {
    errorList.push("museumId is a required field");
  }

  if (commentObject.rate == null) {
    errorList.push("rate is a required field");
  }

  if (!commentObject.review) {
    errorList.push("review is a required field");
  }

  return errorList;
};

export default Comment;
