import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cce_ctf"
    );
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection Error: ${error.message}`);
    // Non-zero exit code on database failure
    process.exit(1);
  }
};
