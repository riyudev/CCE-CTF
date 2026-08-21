import { Submission } from "../models/Submission.js";

/**
 * Attaches individual member scores (and solvesCount) to each member in team.members
 * @param {Object|Array} teamsInput - Mongoose Team document, plain object, or array of teams
 * @returns {Promise<Object|Array>} Teams with member scores attached
 */
export const attachMemberScoresToTeams = async (teamsInput) => {
  if (!teamsInput) return teamsInput;
  const isArray = Array.isArray(teamsInput);
  const teams = isArray ? teamsInput : [teamsInput];
  if (!teams.length) return isArray ? [] : null;

  const teamIds = teams.map((t) => t._id || t.id);

  // Aggregate correct submissions for these teams
  const scoresAggregation = await Submission.aggregate([
    { $match: { team: { $in: teamIds }, correct: true } },
    {
      $group: {
        _id: { team: "$team", user: "$user" },
        score: { $sum: "$points" },
        solvesCount: { $sum: 1 },
      },
    },
  ]);

  // Build lookup map: "teamId:userId" => { score, solvesCount }
  const scoreMap = new Map();
  for (const item of scoresAggregation) {
    if (item._id && item._id.team && item._id.user) {
      const key = `${String(item._id.team)}:${String(item._id.user)}`;
      scoreMap.set(key, { score: item.score || 0, solvesCount: item.solvesCount || 0 });
    }
  }

  const processed = teams.map((teamDoc) => {
    const teamObj = typeof teamDoc.toObject === "function" ? teamDoc.toObject() : { ...teamDoc };
    const teamIdStr = String(teamObj._id || teamObj.id);

    if (Array.isArray(teamObj.members)) {
      teamObj.members = teamObj.members.map((member) => {
        const mObj =
          typeof member === "object" && member !== null
            ? typeof member.toObject === "function"
              ? member.toObject()
              : { ...member }
            : { _id: member };

        const mIdStr = String(mObj._id || mObj.id);
        const stats = scoreMap.get(`${teamIdStr}:${mIdStr}`) || { score: 0, solvesCount: 0 };

        return {
          ...mObj,
          score: stats.score,
          solvesCount: stats.solvesCount,
        };
      });
    }

    return teamObj;
  });

  return isArray ? processed : processed[0];
};
