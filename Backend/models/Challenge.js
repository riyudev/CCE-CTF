import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Challenge title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["WEB", "CRYPTO", "FORENSICS", "REVERSE", "MISC"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"],
    },
    points: {
      type: Number,
      required: true,
      default: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    fileUrl: {
      type: String,
      default: null,
    },
    originalFileName: {
      type: String,
      default: null,
    },
    fileData: {
      type: String,
      default: null,
      select: false, // Base64 encoded file data - excluded from default queries
    },
    flag: {
      type: String,
      required: [true, "Flag is required"],
      select: false, // Never return flag in default queries
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Challenge = mongoose.model("Challenge", challengeSchema);
