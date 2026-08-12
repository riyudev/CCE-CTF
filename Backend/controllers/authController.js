import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Token generator helper
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "cce_ctf_secret_key_2026_super_secure",
    { expiresIn: "7d" }
  );
};

// @desc    Register a new participant user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields." });
    }

    if (username.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check unique username
    const usernameExists = await User.findOne({
      username: username.trim(),
    });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "Username is already taken." });
    }

    // Check unique email
    const emailExists = await User.findOne({ email: email.trim() });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: "Email is already registered." });
    }

    const user = await User.create({
      name: name.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        team: user.team,
      },
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] Register Error:", error.message);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username/email and password." });
    }

    const trimmedIdent = identifier.trim().toLowerCase();

    // Find by username or email
    const user = await User.findOne({
      $or: [{ email: trimmedIdent }, { username: identifier.trim() }],
    }).populate("team", "name code role");

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          team: user.team,
        },
      });
    }

    return res.status(401).json({ message: "Invalid username/email or password." });
  } catch (error) {
    console.error("[AUTH CONTROLLER] Login Error:", error.message);
    return res.status(500).json({ message: "Server error during login." });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("team", "name code score members leader");

    return res.json({ user });
  } catch (error) {
    console.error("[AUTH CONTROLLER] getMe Error:", error.message);
    return res.status(500).json({ message: "Server error fetching user." });
  }
};
