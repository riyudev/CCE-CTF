import express from "express";
import {
  getChallenges,
  getChallengeById,
  submitFlag,
  getSolvedChallenges,
} from "../controllers/challengeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getChallenges);
router.get("/solved", protect, getSolvedChallenges);
router.get("/:id", getChallengeById);
router.post("/:id/submit", protect, submitFlag);

export default router;
