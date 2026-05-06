
import express from "express";
import {
  generateInterviewQuestions,
  generateConceptExplanation,
} from "../controller/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/questions/generate", protect, generateInterviewQuestions);
router.post("/explanations/generate", protect, generateConceptExplanation);

export default router;

