import express from 'express';
import {
  createSession,
  getSessionById,
  getMySession,
  deleteSession,
} from '../controller/sessionController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSession);


router.get('/my-session', protect, getMySession);

router.get('/:id', protect, getSessionById);

router.delete('/:id', protect, deleteSession);

export default router;
