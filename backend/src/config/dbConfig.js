import mongoose from "mongoose";

export const dbConnection = async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("⚠️ Warning: DATABASE_URL is not defined in .env file! MongoDB features may not be available.");
    return;
  }
  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.warn("⚠️ Notice: Could not connect to MongoDB server (" + error.message + "). Backend will continue in standalone mode.");
  }
};
