import mongoose from "mongoose";
import { config } from "../config";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(`${config.db.uri}/${config.db.name}`);
    isConnected = true;
    console.log("mongodb connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};
