import mongoose from "mongoose";
import Config from "../config/env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(Config.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
