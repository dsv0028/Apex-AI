import express from 'express';
import { 
    addPerformance, 
    getPerformance, 
    getPerformanceSummary,
    getMonthlyComparison,
    getSkillRadar,
} from '../controllers/performanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addPerformance);
router.route('/summary/:userId').get(protect, getPerformanceSummary);
router.route('/monthly/:userId').get(protect, getMonthlyComparison);
router.route('/radar/:userId').get(protect, getSkillRadar);
router.route('/:userId').get(protect, getPerformance);

export default router;
