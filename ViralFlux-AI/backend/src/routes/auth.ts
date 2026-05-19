import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';
import {
  signup,
  login,
  googleAuth,
  getMe,
  updateProfile,
  forgotPassword,
} from '../controllers/authController';

const router = Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);

export default router;
