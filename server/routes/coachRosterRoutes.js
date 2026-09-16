import express from 'express';
import { getRosterOverview, bulkAssignWorkout } from '../controllers/coachRosterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getRosterOverview);
router.post('/bulk-assign', bulkAssignWorkout);

export default router;
