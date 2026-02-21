import express from 'express';
import { 
    generateTrainingPlan, 
    getTrainingPlan, 
    updateTrainingProgress 
} from '../controllers/trainingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/generate').post(protect, generateTrainingPlan);
router.route('/progress').put(protect, updateTrainingProgress);
router.route('/:userId').get(protect, getTrainingPlan);

export default router;
