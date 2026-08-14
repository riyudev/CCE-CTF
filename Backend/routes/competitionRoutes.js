import express from "express";
import { getPublicCompetitionStatus } from "../controllers/competitionController.js";

const router = express.Router();

router.get("/", getPublicCompetitionStatus);

export default router;
