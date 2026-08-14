import { Team } from "../models/Team.js";
import { Submission } from "../models/Submission.js";
import { Challenge } from "../models/Challenge.js";

// @desc    Get team leaderboard rankings
// @route   GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find()
      .select("name code score leader members createdAt")
      .sort({ score: -1, updatedAt: 1 });

    const [challengeCount, submissionCount] = await Promise.all([
      Challenge.countDocuments({ isActive: true }),
      Submission.countDocuments(),
    ]);

    const leaderboard = await Promise.all(
      teams.map(async (t, idx) => {
        const solvedCount = await Submission.countDocuments({
          team: t._id,
          correct: true,
        });

        return {
          rank: idx + 1,
          id: t._id,
          team: t.name,
          code: t.code,
          score: t.score,
          solved: solvedCount,
          movement: "same",
        };
      })
    );

    return res.json({
      leaderboard,
      stats: {
        teams: teams.length,
        challenges: challengeCount,
        submissions: submissionCount,
      },
    });
  } catch (error) {
    console.error("[LEADERBOARD CONTROLLER] Error:", error.message);
    return res.status(500).json({ message: "Server error fetching leaderboard." });
  }
};
