import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.SECRET_KEY_DB;

export const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error(
      "MongoDB URI is missing. Create BackEnd/.env with MONGODB_URI (or SECRET_KEY_DB)."
    );
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `>>> Database connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    );
  } catch (error) {
    console.error(">>> Database connection failed:", error.message);
    if (error.message.includes("bad auth")) {
      console.error(
        ">>> Fix: In Atlas go to Database Access, reset the user password, then update MONGODB_URI in BackEnd/.env (use authSource=admin if the user was created there)."
      );
    }
    throw error;
  }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;
