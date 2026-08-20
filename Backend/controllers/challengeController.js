import fs from "fs";
import path from "path";
import { Challenge } from "../models/Challenge.js";
import { Submission } from "../models/Submission.js";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { getCompetitionState } from "./competitionController.js";
import { getChallengeFilePath } from "../middleware/uploadMiddleware.js";

// @desc    Get all active challenges (excluding flag)
// @route   GET /api/challenges
export const getChallenges = async (req, res) => {
  try {
    const compState = await getCompetitionState();

    if (compState.activeState === "ENDED") {
      return res.json({
        challenges: [],
        competitionState: "ENDED",
        message: "CCE CTF challenges have ended. Thank you for participating.",
      });
    }

    if (compState.activeState === "NOT_STARTED") {
      return res.json({
        challenges: [],
        competitionState: "NOT_STARTED",
        message: "The CCE CTF competition has not started yet. Challenges will be available when the event goes live.",
      });
    }

    const challenges = await Challenge.find({ isActive: true }).select("-flag");
    return res.json({ challenges, competitionState: "LIVE" });
  } catch (error) {
    console.error("[CHALLENGE CONTROLLER] Get Challenges Error:", error.message);
    return res.status(500).json({ message: "Server error fetching challenges." });
  }
};

// @desc    Get challenge details by ID (excluding flag)
// @route   GET /api/challenges/:id
export const getChallengeById = async (req, res) => {
  try {
    const compState = await getCompetitionState();

    if (compState.activeState === "ENDED") {
      return res.status(403).json({
        message: "CCE CTF challenges have ended. Thank you for participating.",
        competitionState: "ENDED",
      });
    }

    if (compState.activeState === "NOT_STARTED") {
      return res.status(403).json({
        message: "The CCE CTF competition has not started yet.",
        competitionState: "NOT_STARTED",
      });
    }

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

// @desc    Download challenge file with original filename
// @route   GET /api/challenges/:id/download
export const downloadChallengeFile = async (req, res) => {
  try {
    const compState = await getCompetitionState();

    if (compState.activeState === "ENDED") {
      return res.status(403).json({
        message: "CCE CTF challenges have ended. Thank you for participating.",
        competitionState: "ENDED",
      });
    }

    if (compState.activeState === "NOT_STARTED") {
      return res.status(403).json({
        message: "The CCE CTF competition has not started yet.",
        competitionState: "NOT_STARTED",
      });
    }

    const challenge = await Challenge.findById(req.params.id).select("+fileData");
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: "Challenge not found." });
    }

    if (!challenge.fileUrl && !challenge.fileData) {
      return res.status(404).json({ message: "No file available for this challenge." });
    }

    const storedFilename = challenge.fileUrl ? path.basename(challenge.fileUrl) : "challenge_file";
    const downloadName = challenge.originalFileName || storedFilename;

    // 1. Primary for Production: serve binary file directly from MongoDB Base64 data
    if (challenge.fileData) {
      const fileBuffer = Buffer.from(challenge.fileData, "base64");
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(downloadName)}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
      );
      res.setHeader("Content-Length", fileBuffer.length);
      return res.send(fileBuffer);
    }

    // 2. Redirect to external HTTP/HTTPS URL if provided
    if (challenge.fileUrl && (challenge.fileUrl.startsWith("http://") || challenge.fileUrl.startsWith("https://"))) {
      return res.redirect(challenge.fileUrl);
    }

    // 3. Fallback to local server disk storage if file exists
    if (challenge.fileUrl) {
      const filePath = getChallengeFilePath(storedFilename);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, downloadName);
      }
    }

    // 4. Fallback text file for legacy/seeded sample challenges missing binary payload
    const fallbackText = `CCE CTF Challenge Asset: ${challenge.title}\nFilename: ${downloadName}\n\n[Challenge asset file container generated for production environment]`;
    const fallbackBuffer = Buffer.from(fallbackText, "utf-8");
    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(downloadName)}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
    );
    res.setHeader("Content-Length", fallbackBuffer.length);
    return res.send(fallbackBuffer);
  } catch (error) {
    console.error("[CHALLENGE CONTROLLER] Download File Error:", error.message);
    return res.status(500).json({ message: "Server error downloading challenge file." });
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

