import { Competition } from "../models/Competition.js";

// Helper function to calculate competition state based on DB settings and server time
export const getCompetitionState = async () => {
  let competition = await Competition.findOne();
  if (!competition) {
    competition = await Competition.create({});
  }

  const now = new Date();
  const startTime = competition.startTime ? new Date(competition.startTime) : null;
  const endTime = competition.endTime ? new Date(competition.endTime) : null;

  let activeState = competition.status;

  if (competition.status === "ENDED") {
    activeState = "ENDED";
  } else if (competition.status === "UPCOMING") {
    activeState = "NOT_STARTED";
  } else if (competition.status === "LIVE") {
    if (startTime && !isNaN(startTime.getTime()) && now < startTime) {
      activeState = "NOT_STARTED";
    } else if (endTime && !isNaN(endTime.getTime()) && now >= endTime) {
      activeState = "ENDED";
    } else {
      activeState = "LIVE";
    }
  }

  return {
    competition,
    activeState,
    serverTime: now.toISOString(),
    startTime: competition.startTime,
    endTime: competition.endTime,
    status: competition.status,
  };
};

// @desc    Get public competition status and server time
// @route   GET /api/competition
export const getPublicCompetitionStatus = async (req, res) => {
  try {
    const state = await getCompetitionState();
    return res.json({
      name: state.competition.name,
      status: state.status,
      activeState: state.activeState,
      startTime: state.startTime,
      endTime: state.endTime,
      serverTime: state.serverTime,
      registrationOpen: state.competition.registrationOpen,
      maxTeamSize: state.competition.maxTeamSize,
    });
  } catch (error) {
    console.error("[COMPETITION CONTROLLER] Error:", error.message);
    return res.status(500).json({ message: "Error fetching competition status." });
  }
};
