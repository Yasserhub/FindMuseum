import mongoose from "mongoose";

const { SchemaTypes } = mongoose;

const tokenSchema = new mongoose.Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});
const Token = mongoose.model("Token", tokenSchema);
export default Token;
