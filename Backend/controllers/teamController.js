import { Team } from "../models/Team.js";
import { User } from "../models/User.js";

// Random team code generator
const generateTeamCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CCE-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Create a new team
// @route   POST /api/teams
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Team name is required." });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      return res
        .status(400)
        .json({ message: "Team name must be at least 3 characters." });
    }

    // Check if user is already in a team
    const currentUser = await User.findById(userId);
    if (currentUser.team) {
      return res
        .status(400)
        .json({ message: "You are already a member of a team." });
    }

    // Check if team name exists
    const existingTeam = await Team.findOne({ name: trimmedName });
    if (existingTeam) {
      return res
        .status(400)
        .json({ message: "A team with this name already exists." });
    }

    // Generate unique code
    let code = generateTeamCode();
    let codeExists = await Team.findOne({ code });
    while (codeExists) {
      code = generateTeamCode();
      codeExists = await Team.findOne({ code });
    }

    const team = await Team.create({
      name: trimmedName,
      code,
      leader: userId,
      members: [userId],
    });

    // Update user reference and assign team leader role
    currentUser.team = team._id;
    if (currentUser.role !== "admin") {
      currentUser.role = "leader";
    }
    await currentUser.save();

    const populatedTeam = await Team.findById(team._id)
      .populate("leader", "name username email")
      .populate("members", "name username email");

    return res.status(201).json({
      team: populatedTeam,
      role: currentUser.role,
    });
  } catch (error) {
    console.error("[TEAM CONTROLLER] Create Team Error:", error.message);
    return res.status(500).json({ message: "Server error during team creation." });
  }
};

// @desc    Join an existing team via code
// @route   POST /api/teams/join
export const joinTeam = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Team code is required." });
    }

    const currentUser = await User.findById(userId);
    if (currentUser.team) {
      return res
        .status(400)
        .json({ message: "You are already a member of a team." });
    }

    const formattedCode = code.trim().toUpperCase();
    const team = await Team.findOne({ code: formattedCode });

    if (!team) {
      return res
        .status(404)
        .json({ message: "Invalid team code. Please check with your team leader." });
    }

    if (team.members.length >= 5) {
      return res
        .status(400)
        .json({ message: "This team has already reached the maximum limit of 5 members." });
    }

    // Add user to team
    team.members.push(userId);
    await team.save();

    currentUser.team = team._id;
    if (currentUser.role !== "admin") {
      currentUser.role = "participant";
    }
    await currentUser.save();

    const populatedTeam = await Team.findById(team._id)
      .populate("leader", "name username email")
      .populate("members", "name username email");

    return res.json({ team: populatedTeam, role: currentUser.role });
  } catch (error) {
    console.error("[TEAM CONTROLLER] Join Team Error:", error.message);
    return res.status(500).json({ message: "Server error joining team." });
  }
};

// @desc    Get user's team details
// @route   GET /api/teams/me
export const getMyTeam = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser.team) {
      return res.json({ team: null });
    }

    const team = await Team.findById(currentUser.team)
      .populate("leader", "name username email")
      .populate("members", "name username email");

    return res.json({ team });
  } catch (error) {
    console.error("[TEAM CONTROLLER] Get My Team Error:", error.message);
    return res.status(500).json({ message: "Server error fetching team details." });
  }
};

// @desc    Leave current team
// @route   POST /api/teams/leave
export const leaveTeam = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser.team) {
      return res.status(400).json({ message: "You are not in a team." });
    }

    const team = await Team.findById(currentUser.team);
    if (!team) {
      currentUser.team = null;
      if (currentUser.role !== "admin") {
        currentUser.role = "participant";
      }
      await currentUser.save();
      return res.json({ message: "Left team successfully." });
    }

    // Prevent team leader from leaving without transferring leadership
    if (String(team.leader) === String(currentUser._id)) {
      return res.status(400).json({
        message: "Team leaders cannot leave the team. Transfer leadership or delete the team.",
      });
    }

    // Remove user from team members
    team.members = team.members.filter(
      (m) => String(m) !== String(currentUser._id)
    );
    await team.save();

    currentUser.team = null;
    if (currentUser.role !== "admin") {
      currentUser.role = "participant";
    }
    await currentUser.save();

    return res.json({ message: "Left team successfully." });
  } catch (error) {
    console.error("[TEAM CONTROLLER] Leave Team Error:", error.message);
    return res.status(500).json({ message: "Server error leaving team." });
  }
};
