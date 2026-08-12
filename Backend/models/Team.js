import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Team name must be at least 3 characters"],
      maxlength: [24, "Team name must not exceed 24 characters"],
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model("Team", teamSchema);
