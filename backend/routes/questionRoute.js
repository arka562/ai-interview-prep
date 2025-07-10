import express from 'express';
import {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionToSession
} from '../controller/questionController.js';

import protect from '../middleware/authMiddleware.js';

const router = express.Router();


router.patch('/:id/pin', protect, togglePinQuestion);

router.patch('/:id/note', protect, updateQuestionNote);

router.post('/:sessionId', protect, addQuestionToSession);

export default router;
