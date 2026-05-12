import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "lexflow",
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("connected", () => {
      console.log(" Mongoose connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error(" Mongoose error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(" Mongoose disconnected");
    });

  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;