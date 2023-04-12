import mongoose from "mongoose";

const connectDB = () => mongoose.connect(process.env.MONGODB_URL1);

export default connectDB;
