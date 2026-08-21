import express from "express";
import {
  getAdminUsers,
  deleteAdminUser,
  getAdminTeams,
  deleteAdminTeam,
  getAdminChallenges,
  createAdminChallenge,
  updateAdminChallenge,
  deleteAdminChallenge,
  getAdminSubmissions,
  getAdminCompetitionSettings,
  updateAdminCompetitionSettings,
  getAdminTeamSolves,
} from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import { challengeFileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect, requireAdmin);

// User Management
router.get("/users", getAdminUsers);
router.delete("/users/:id", deleteAdminUser);

// Team Management
router.get("/teams", getAdminTeams);
router.delete("/teams/:id", deleteAdminTeam);
router.get("/team-solves", getAdminTeamSolves);

// Challenge CRUD
router.get("/challenges", getAdminChallenges);
router.post("/challenges", challengeFileUpload.single("file"), createAdminChallenge);
router.put("/challenges/:id", challengeFileUpload.single("file"), updateAdminChallenge);
router.delete("/challenges/:id", deleteAdminChallenge);

// Submission Monitoring
router.get("/submissions", getAdminSubmissions);

// Competition Settings
router.get("/competition", getAdminCompetitionSettings);
router.put("/competition", updateAdminCompetitionSettings);

export default router;
