import express from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/me').get(protect, getProfile).put(protect, updateProfile);
router.route('/password').put(protect, changePassword);

export default router;
