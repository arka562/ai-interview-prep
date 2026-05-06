import express from 'express';
import { generateInterviewQuestions, generateConceptExplanation } from '../controller/aiController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-questions', protect, generateInterviewQuestions);
router.post('/generate-explanations', protect, generateConceptExplanation);

export default router;
