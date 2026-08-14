import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "CCE CTF Competition",
    },
    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "ENDED"],
      default: "LIVE",
    },
    startTime: {
      type: String,
      default: "2026-08-12T08:00:00.000Z",
    },
    endTime: {
      type: String,
      default: "2026-08-14T18:00:00.000Z",
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

