import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controller/authController.js';
import  protect  from '../middleware/authMiddleware.js';
import upload from"../middleware/uploadMiddleware.js"

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No File Uploaded' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl,
  });
});

export default router;
 