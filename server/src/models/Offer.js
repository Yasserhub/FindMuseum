import mongoose from "mongoose";
const { SchemaTypes } = mongoose;
const offerSchema = new mongoose.Schema({
  expireDate: { type: Date, required: true },
  numberOfTickets: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  museumId: {
    type: SchemaTypes.ObjectId,
    ref: "Museum",
    required: true,
  },
  buyers: [
    {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});
const Offer = mongoose.model("offers", offerSchema);
export default Offer;
