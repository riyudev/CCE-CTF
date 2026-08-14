import { User } from "../models/User.js";
import { Team } from "../models/Team.js";
import { Challenge } from "../models/Challenge.js";
import { Submission } from "../models/Submission.js";
import { Competition } from "../models/Competition.js";

// --- USERS ---
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("team", "name code");
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users for admin." });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: "Admin cannot delete their own account." });
    }
    const userToDelete = await User.findById(req.params.id);
    if (userToDelete && userToDelete.team) {
      await Team.findByIdAndUpdate(userToDelete.team, {
        $pull: { members: userToDelete._id },
      });
    }
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user." });
  }
};

// --- TEAMS ---
export const getAdminTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leader", "name username email")
      .populate("members", "name username email");
    return res.json({ teams });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching teams for admin." });
  }
};

export const deleteAdminTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    await User.updateMany({ team: teamId }, { $set: { team: null } });
    await Team.findByIdAndDelete(teamId);
    return res.json({ message: "Team deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting team." });
  }
};

// --- CHALLENGES ---
export const getAdminChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().select("+flag");
    return res.json({ challenges });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admin challenges." });
  }
};

export const createAdminChallenge = async (req, res) => {
  try {
    const { title, category, difficulty, points, description, flag, fileUrl } = req.body;
    if (!title || !category || !difficulty || !points || !description || !flag) {
      return res.status(400).json({ message: "All challenge fields are required." });
    }

    const challenge = await Challenge.create({
      title: title.trim(),
      category,
      difficulty,
      points: Number(points),
      description: description.trim(),
      flag: flag.trim(),
      fileUrl: fileUrl || null,
    });

    return res.status(201).json({ challenge });
  } catch (error) {
    return res.status(500).json({ message: "Error creating challenge." });
  }
};

export const updateAdminChallenge = async (req, res) => {
  try {
    const { title, category, difficulty, points, description, flag, fileUrl, isActive } = req.body;
    const challenge = await Challenge.findById(req.params.id).select("+flag");
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found." });
    }

    if (title) challenge.title = title.trim();
    if (category) challenge.category = category;
    if (difficulty) challenge.difficulty = difficulty;
    if (points !== undefined) challenge.points = Number(points);
    if (description) challenge.description = description.trim();
    if (flag) challenge.flag = flag.trim();
    if (fileUrl !== undefined) challenge.fileUrl = fileUrl;
    if (isActive !== undefined) challenge.isActive = isActive;

    await challenge.save();
    return res.json({ challenge });
  } catch (error) {
    return res.status(500).json({ message: "Error updating challenge." });
  }
};

export const deleteAdminChallenge = async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
    return res.json({ message: "Challenge deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting challenge." });
  }
};

// --- SUBMISSIONS ---
export const getAdminSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("user", "name username")
      .populate("team", "name code")
      .populate("challenge", "title category points")
      .sort({ createdAt: -1 });

    return res.json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admin submissions." });
  }
};

// --- COMPETITION SETTINGS ---
export const getAdminCompetitionSettings = async (req, res) => {
  try {
    let settings = await Competition.findOne();
    if (!settings) {
      settings = await Competition.create({});
    }
    return res.json({ competition: settings });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching competition settings." });
  }
};

export const updateAdminCompetitionSettings = async (req, res) => {
  try {
    let settings = await Competition.findOne();
    if (!settings) {
      settings = new Competition(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    return res.json({ competition: settings });
  } catch (error) {
    return res.status(500).json({ message: "Error updating competition settings." });
  }
};
