import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "E-commerce",
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error in database connection:", err.message);
    process.exit(1); 
  }
};