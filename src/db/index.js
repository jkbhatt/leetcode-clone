// mongoose is a bridge between Node.js and MongoDB
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // Log which server we connected to
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log error and stop the app
    console.log("MongoDB connection error:", error);
    process.exit(1); //Stop backend immediately
  }
};

export default connectDB;