import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "CCE CTF Competition",
    },
    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "PAUSED", "ENDED"],
      default: "LIVE",
    },
    startTime: {
      type: String,
      default: "2026-08-12 08:00:00 UTC",
    },
    endTime: {
      type: String,
      default: "2026-08-12 18:00:00 UTC",
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    maxTeamSize: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const Competition = mongoose.model("Competition", competitionSchema);
