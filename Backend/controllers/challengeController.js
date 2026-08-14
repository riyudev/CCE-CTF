import { Challenge } from "../models/Challenge.js";
import { Submission } from "../models/Submission.js";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { getCompetitionState } from "./competitionController.js";

// @desc    Get all active challenges (excluding flag)
// @route   GET /api/challenges
export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).select("-flag");
    return res.json({ challenges });
  } catch (error) {
    console.error("[CHALLENGE CONTROLLER] Get Challenges Error:", error.message);
    return res.status(500).json({ message: "Server error fetching challenges." });
  }
};

// @desc    Get challenge details by ID (excluding flag)
// @route   GET /api/challenges/:id
export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).select("-flag");
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: "Challenge not found." });
    }
    return res.json({ challenge });
  } catch (error) {
    console.error("[CHALLENGE CONTROLLER] Get Challenge By ID Error:", error.message);
    return res.status(500).json({ message: "Server error fetching challenge details." });
  }
};

// @desc    Get IDs of challenges solved by the authenticated user's team
// @route   GET /api/challenges/solved
export const getSolvedChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.team) {
      return res.json({ solvedChallengeIds: [] });
    }

    const solvedSubmissions = await Submission.find({
      team: user.team,
      correct: true,
    }).select("challenge");

    const solvedChallengeIds = solvedSubmissions.map((s) => String(s.challenge));
    return res.json({ solvedChallengeIds });
  } catch (error) {
    console.error("[CHALLENGE CONTROLLER] Get Solved Challenges Error:", error.message);
    return res.status(500).json({ message: "Server error fetching solved challenges." });
  }
};

// @desc    Submit a flag for a challenge
// @route   POST /api/challenges/:id/submit
export const submitFlag = async (req, res) => {
  try {
    // 1. Enforce Server Competition Status
    const compState = await getCompetitionState();
    if (compState.activeState === "ENDED") {
      return res.status(400).json({
        message: "Thank you for participating. The CCE-CTF competition has ended.",
        code: "COMPETITION_ENDED",
        competitionEnded: true,
      });
    }

    if (compState.activeState === "NOT_STARTED") {
      return res.status(400).json({
        message: "Please wait until the competition begins.",
        code: "COMPETITION_NOT_STARTED",
        competitionEnded: false,
      });
    }

    if (compState.activeState === "PAUSED") {
      return res.status(400).json({
        message: "The competition is currently paused by administrators.",
        code: "COMPETITION_PAUSED",
        competitionEnded: false,
      });
    }

    const { flag } = req.body;
    const userId = req.user._id;

    if (!flag || !flag.trim()) {
      return res.status(400).json({ message: "Flag submission cannot be empty." });
    }

    const user = await User.findById(userId);
    if (!user.team) {
      return res
        .status(400)
        .json({ message: "You must create or join a team before submitting flags." });
    }

    const challenge = await Challenge.findById(req.params.id).select("+flag");
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: "Challenge not found." });
    }

    // Check if team already solved this challenge
    const existingSolve = await Submission.findOne({
      team: user.team,
      challenge: challenge._id,
      correct: true,
    });

    if (existingSolve) {
      return res.json({
        correct: true,
        points: 0,
        alreadySolved: true,
        message: "Challenge already solved by your team!",
      });
    }

    // Flag validation
    const submittedFlagTrimmed = flag.trim();
    const isCorrect = submittedFlagTrimmed.toLowerCase() === challenge.flag.trim().toLowerCase();

    // Create submission record in DB
    const submission = await Submission.create({
      user: userId,
      team: user.team,
      challenge: challenge._id,
      submittedFlag: submittedFlagTrimmed,
      correct: isCorrect,
      points: isCorrect ? challenge.points : 0,
      submittedAt: new Date(),
    });

    if (isCorrect) {
      // Award points to team
      await Team.findByIdAndUpdate(user.team, {
        $inc: { score: challenge.points },
      });

      return res.json({
        correct: true,
        points: challenge.points,
        message: "Correct flag! Team points updated.",
        submissionId: submission._id,
      });
    }

    return res.json({
      correct: false,
      points: 0,
      message: "Incorrect flag.",
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("[CHALLENGE CONTROLLER] Submit Flag Error:", error.message);
    return res.status(500).json({ message: "Server error submitting flag." });
  }
};

