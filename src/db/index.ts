import mongoose from "mongoose";
import { db_name, mongodb_uri } from "../config";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(`${mongodb_uri}/${db_name}`);
    isConnected = true;
    console.log("mongodb connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};
