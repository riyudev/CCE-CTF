import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    submittedFlag: {
      type: String,
      required: true,
    },
    correct: {
      type: Boolean,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to efficiently check if a team solved a challenge
submissionSchema.index({ team: 1, challenge: 1, correct: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);
