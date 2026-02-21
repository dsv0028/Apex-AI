import express from 'express';
import { 
    getAthletes, 
    getAthletePerformance, 
    assignTraining, 
    submitFeedback 
} from '../controllers/coachController.js';
import { protect, coachGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/athletes').get(protect, coachGuard, getAthletes);
router.route('/performance/:athleteId').get(protect, coachGuard, getAthletePerformance);
router.route('/assign-training').post(protect, coachGuard, assignTraining);
router.route('/feedback').post(protect, coachGuard, submitFeedback);

export default router;
