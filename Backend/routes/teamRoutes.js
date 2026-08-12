import express from "express";
import {
  createTeam,
  joinTeam,
  getMyTeam,
  leaveTeam,
} from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createTeam);
router.post("/join", joinTeam);
router.get("/me", getMyTeam);
router.post("/leave", leaveTeam);

export default router;
